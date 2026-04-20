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
  // 시간과 관계없이 날짜만 반영된 KST 기준 정확히 한 달 뒤 자정 문자열을 명시적으로 생성 (예: 2024-05-20T00:00:00+09:00)
  const nowUtc = new Date();
  const kstNow = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
  kstNow.setMonth(kstNow.getMonth() + 1); // 다음 달
  const nextBillingDateKstStr = `${kstNow.getFullYear()}-${String(kstNow.getMonth() + 1).padStart(2, '0')}-${String(kstNow.getDate()).padStart(2, '0')}T00:00:00+09:00`;

  const { error: subError } = await adminSupabase.from('subscriptions').insert({
    user_id: user.id,
    billing_key: billingKey,
    customer_key: customerKey,
    status: 'active',
    current_period_start: nowUtc.toISOString(),
    current_period_end: nextBillingDateKstStr,
    next_billing_date: nextBillingDateKstStr,
    amount: 5000,
  });

  if (subError) {
    console.error("구독 정보 저장 실패:", subError);
    throw new Error("구독 생성 중 오류가 발생했습니다.");
  }

  // 4. 첫 결제 실행 (빌링키 발급 시점에 첫 결제를 바로 실행)
  try {
    await chargeBillingAction(user.id);
  } catch (chargeError) {
    console.error("첫 결제 실패 (빌링키는 발급됨):", chargeError);
    // 향후 정책: 첫 결제가 실패하면 구독 status를 'expired' 또는 'payment_failed' 처리 고려.
    // 본 실습에서는 우선 구독은 생성시키지만 로그에 오류를 남깁니다.
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

  // 4. 성공 시 다음 결제일 KST 갱신 및 로그 기록
  const oldKstDate = new Date(new Date(sub.next_billing_date).getTime() + 9 * 60 * 60 * 1000);
  oldKstDate.setMonth(oldKstDate.getMonth() + 1);
  const nextBillingDateKstStr = `${oldKstDate.getFullYear()}-${String(oldKstDate.getMonth() + 1).padStart(2, '0')}-${String(oldKstDate.getDate()).padStart(2, '0')}T00:00:00+09:00`;

  await adminSupabase.from('subscriptions').update({
    current_period_start: sub.next_billing_date,
    current_period_end: nextBillingDateKstStr,
    next_billing_date: nextBillingDateKstStr,
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
      billing_key: 'CANCELED', // 사용자가 허가한 권장 방식: 빌링키를 무효 더미(Dummy) 값으로 파기하여 재사용 방지
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

/**
 * 4. 배치 결제 처리 (Cron Job 에서 호출)
 */
export async function processBatchChargeAction() {
  const adminSupabase = await createAdminClient();
  
  // KST 상관없이 next_billing_date 자체가 T00:00:00+09:00 형식으로 저장되어 있으므로,
  // 현재 시간(UTC) 기준으로 과거이거나 지금인 것들을 모두 가져옵니다 (지연 발생 대비 lte 사용).
  const nowUtc = new Date();
  
  const { data: subs, error } = await adminSupabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')
    .eq('cancel_at_period_end', false)
    .lte('next_billing_date', nowUtc.toISOString());

  if (error) {
    console.error("배치 결제 대상 조회 실패:", error);
    return { success: false, error: error.message };
  }

  if (!subs || subs.length === 0) {
    return { success: true, message: "결제 대상이 없습니다.", count: 0 };
  }

  let successCount = 0;
  let failCount = 0;

  // 모든 빌링키에 대해 결제 함수 실행 (시간과 관계없이 오늘 결제해야 하는 빌링키)
  for (const sub of subs) {
    try {
      await chargeBillingAction(sub.user_id);
      successCount++;
    } catch (e) {
      console.error(`user_id ${sub.user_id} 정기 결제 실패:`, e);
      failCount++;
    }
  }

  return { 
    success: true, 
    message: "배치 결제 처리 완료", 
    total: subs.length, 
    successCount, 
    failCount 
  };
}
