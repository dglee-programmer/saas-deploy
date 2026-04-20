import React from 'react';
import { Header } from '../_components/Header';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/app/actions/auth.actions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { PaymentWidget } from './_components/PaymentWidget';
import { getMySubscriptionAction, cancelSubscriptionAction } from '@/app/actions/billing.actions';

export default async function BillingPage() {
  const user = await getUserSession();
  
  if (!user) {
    redirect('/auth');
  }

  // 사용자의 현재 구독 상태 조회
  const subscription = await getMySubscriptionAction();
  const isPremium = subscription !== null;

  // 임시 주문번호 생성 (위젯용)
  const orderId = `order_${Date.now()}`;

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-12 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <Icon name={isPremium ? "stars" : "payments"} size={48} filled />
          </div>
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-black text-on-surface">
              {isPremium ? "구독 정보를 확인하세요" : "프리미엄 멤버십"}
            </h1>
            <p className="text-on-surface-variant font-medium text-lg">
              {isPremium ? "현재 프리미엄 혜택을 누리고 계십니다" : "품격 있는 아키텍처 큐레이션을 위한 최적의 선택"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full items-start">
          {/* Benefit Card */}
          <div className="p-8 bg-surface-container-low rounded-3xl border border-outline-variant/20 text-left space-y-6 h-full">
            <h3 className="font-headline text-xl font-bold text-on-surface">제공되는 혜택</h3>
            <ul className="space-y-4">
              {[
                "무제한 메모 보관",
                "스마트 AI 검색 및 요약",
                "커스텀 폴더 및 태그 보드",
                "우선 순위 고객 지원"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                  <Icon name="check_circle" className="text-primary" size={20} />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-end">
              <div>
                <div className="text-xs text-outline mb-1">월 구독료</div>
                <div className="text-3xl font-black text-on-surface">5,000<span className="text-base font-bold ml-1">원</span></div>
              </div>
              {isPremium && (
                <div className="text-right">
                  <div className="text-xs text-outline mb-1">상태</div>
                  <div className="inline-flex items-center px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-md">
                    사용 중
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section / Management UI */}
          <div className="w-full">
            {isPremium ? (
              <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-outline-variant/10 shadow-xl space-y-8 text-left">
                <h4 className="text-xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">구독 관리</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xs text-outline">다음 결제 예정일</p>
                      <p className="font-bold text-on-surface">
                        {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                      <Icon name="event_repeat" size={24} />
                    </div>
                  </div>

                  {subscription.cancel_at_period_end ? (
                    <div className="p-4 bg-error-container/10 border border-error/20 rounded-2xl flex gap-3">
                      <Icon name="warning" className="text-error shrink-0" size={20} />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-on-error-container">해지 예약됨</p>
                        <p className="text-xs text-on-error-container/70">
                          {new Date(subscription.current_period_end).toLocaleDateString()} 이후 구독이 종료됩니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form action={cancelSubscriptionAction}>
                      <Button
                        variant="ghost"
                        size="md"
                        className="w-full text-error hover:bg-error/5 border border-error/10"
                        type="submit"
                        leftIcon="cancel"
                      >
                        구독 해지하기
                      </Button>
                      <p className="text-[10px] text-center text-outline mt-3">
                        해지하셔도 남은 기간 동안 프리미엄 혜택은 유지됩니다.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <PaymentWidget 
                customerKey={user.id} 
                orderId={orderId} 
                orderName="anynote 프리미엄 구독 (1개월)" 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
