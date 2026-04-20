import { NextResponse } from 'next/server';
import { createAdminClient } from '@/infrastructure/config/supabase/server';
import { chargeBillingAction } from '@/app/actions/billing.actions';

/**
 * 정기 결제 실행 API (Vercel Cron 또는 수동 호출용)
 * POST /api/billing/charge
 */
export async function POST(request: Request) {
  // 1. 시크릿 키 인증
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminSupabase = await createAdminClient();

  // 2. 결제 대상 조회: next_billing_date <= NOW AND status = 'active'
  const { data: subs, error: fetchError } = await adminSupabase
    .from('subscriptions')
    .select('id, user_id, cancel_at_period_end, current_period_end')
    .eq('status', 'active')
    .lte('next_billing_date', new Date().toISOString());

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const results = [];

  // 3. 각 구독에 대해 처리
  for (const sub of subs) {
    try {
      // 해지 예약(cancel_at_period_end)된 경우 보너스 처리
      // 기간이 끝났으면 status만 canceled로 바꾸고 결제는 안 함
      const isPeriodEnd = new Date(sub.current_period_end) <= new Date();
      
      if (sub.cancel_at_period_end && isPeriodEnd) {
        // 구독 종료 처리
        await adminSupabase.from('subscriptions').update({ 
          status: 'canceled', 
          updated_at: new Date().toISOString() 
        }).eq('id', sub.id);
        
        await adminSupabase.from('users').update({ 
          subscription_tier: 'standard', 
          updated_at: new Date().toISOString() 
        }).eq('id', sub.user_id);
        
        results.push({ userId: sub.user_id, status: 'canceled' });
      } else {
        // 실제 결제 실행
        await chargeBillingAction(sub.user_id);
        results.push({ userId: sub.user_id, status: 'charged' });
      }
    } catch (err: any) {
      console.error(`Billing failed for user ${sub.user_id}:`, err);
      results.push({ userId: sub.user_id, status: 'failed', error: err.message });
    }
  }

  return NextResponse.json({ 
    message: `Processed ${subs.length} subscriptions`,
    results 
  });
}
