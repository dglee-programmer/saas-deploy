'use server'

import { createClient, createAdminClient } from '@/infrastructure/config/supabase/server';
import { revalidatePath } from 'next/cache';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

/**
 * 1. 빌링키 발급 요청 (카드 등록 완료 후 호출)
 */
export async function issueBillingKeyAction(authKey: string, customerKey: string) {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  // 1. 중복 가입 체크 (이미 활성 구독이 있는지 확인)
  const { data: existingSub } = await adminSupabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (existingSub) {
    return { success: true, message: "이미 활성 구독이 존재합니다." };
  }

  // 2. 토스 API 호출: 빌링키 발급
  const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  const response = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${encodedKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authKey,
      customerKey,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "빌링키 발급 중 오류가 발생했습니다.");
  }

  const { billingKey } = result;

  // 3. DB에 구독 정보 저장 (Admin Client 사용 - RLS 우회)
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  const { error: subError } = await adminSupabase.from('subscriptions').insert({
    user_id: user.id,
    billing_key: billingKey,
    customer_key: customerKey,
    status: 'active',
    current_period_start: now.toISOString(),
    current_period_end: nextMonth.toISOString(),
    next_billing_date: nextMonth.toISOString(),
    amount: 5000,
  });

  if (subError) {
    console.error("구독 정보 저장 실패:", subError);
    throw new Error("구독 생성 중 오류가 발생했습니다.");
  }

  // 4. 첫 결제 실행 (빌링키 발급 시점에 첫 결제를 수행하는 것이 일반적)
  try {
    await chargeBillingAction(user.id);
  } catch (chargeError) {
    console.error("첫 결제 실패 (빌링키는 발급됨):", chargeError);
    // 첫 결제 실패 시 정책에 따라 처리 (여기서는 일단 보류하거나 에러 반환)
  }

  // 5. 유저 정보 업데이트
  await adminSupabase.from('users').update({ 
    subscription_tier: 'premium',
    updated_at: new Date().toISOString()
  }).eq('id', user.id);

  revalidatePath('/dashboard/billing');
  return { success: true, billingKey };
}

/**
 * 2. 정기 결제 실행 (Cron 또는 수동 트리거)
 */
export async function chargeBillingAction(userId: string) {
  const adminSupabase = await createAdminClient();

  // 1. 구독 정보 및 빌링키 조회
  const { data: sub, error: subFetchError } = await adminSupabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (subFetchError || !sub) {
    throw new Error("유효한 활성 구독이 없습니다.");
  }

  // 2. 토스 API 호출: 빌링 결제 승인
  const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  const orderId = `sub_${Date.now()}_${userId.slice(0, 8)}`;
  
  const response = await fetch(`https://api.tosspayments.com/v1/billing/${sub.billing_key}`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${encodedKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerKey: sub.customer_key,
      orderId,
      orderName: "Anynote 프리미엄 구독",
      amount: sub.amount,
    }),
  });

  const result = await response.json();

  // 3. 결제 결과 기록
  if (!response.ok) {
    await adminSupabase.from('payment_logs').insert({
      user_id: userId,
      order_id: orderId,
      amount: sub.amount,
      status: 'FAILED',
      fail_reason: result.message || "빌링 결제 승인 실패"
    });
    throw new Error(result.message || "정기 결제 승인 실패");
  }

  // 4. 성공 시 다음 결제일 갱신 및 로그 기록
  const nextBilling = new Date(sub.next_billing_date);
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  await adminSupabase.from('subscriptions').update({
    current_period_start: sub.next_billing_date,
    current_period_end: nextBilling.toISOString(),
    next_billing_date: nextBilling.toISOString(),
    updated_at: new Date().toISOString()
  }).eq('id', sub.id);

  await adminSupabase.from('payment_logs').insert({
    user_id: userId,
    order_id: orderId,
    amount: sub.amount,
    status: 'SUCCESS'
  });

  return { success: true, payment: result };
}

/**
 * 3. 구독 해지 예약 (기간 만료 후 해지)
 */
export async function cancelSubscriptionAction() {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await adminSupabase
    .from('subscriptions')
    .update({ 
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('status', 'active');

  if (error) {
    console.error("해지 예약 실패:", error);
    throw new Error("구독 해지 예약 중 오류가 발생했습니다.");
  }

  revalidatePath('/dashboard/billing');
}

/**
 * [추가] 현재 구독 정보 가져오기 (UI용)
 */
export async function getMySubscriptionAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS 정책에 의해 billing_key는 제외하고 조회하도록 권고하지만, 
  // 여기서는 클라이언트 측에 필요한 정보만 명시적으로 선택
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, cancel_at_period_end, current_period_end, next_billing_date, amount')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  return sub;
}

/**
 * 기존 로그 관련 액션 유지
 */
export async function createPaymentLogAction(orderId: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  await supabase.from('payment_logs').insert({
    user_id: user.id,
    order_id: orderId,
    amount,
    status: 'PENDING'
  });
}

export async function updatePaymentStatusAction(orderId: string, status: 'SUCCESS' | 'FAILED' | 'CANCELED', failReason?: string) {
  const adminSupabase = await createAdminClient(); // 상태 업데이트는 admin으로 안전하게 처리
  await adminSupabase.from('payment_logs').update({
    status,
    fail_reason: failReason || null,
    updated_at: new Date().toISOString()
  }).eq('order_id', orderId);
}
