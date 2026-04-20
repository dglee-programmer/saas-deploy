"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cancelSubscriptionAction } from '@/app/actions/billing.actions';

interface CancelSubscriptionDialogProps {
  currentPeriodEnd: string;
}

export function CancelSubscriptionDialog({ currentPeriodEnd }: CancelSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleCancelClick = () => {
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await cancelSubscriptionAction();
      setIsOpen(false);
    } catch (error) {
      console.error("구독 해지 오류:", error);
      alert("구독 해지 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="md"
        className="w-full text-error hover:bg-error/5 border border-error/10"
        onClick={handleCancelClick}
        leftIcon="cancel"
      >
        구독 해지하기
      </Button>

      {/* Confirmation Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-outline-variant/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
                <Icon name="warning" size={32} filled />
              </div>
              <h3 className="font-headline text-2xl font-black tracking-tight text-on-surface">
                정말 취소하시겠습니까?
              </h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed pb-4">
                구독을 취소하더라도 결제된 이번 주기인 <br />
                <strong className="text-primary font-bold">{new Date(currentPeriodEnd).toLocaleDateString('ko-KR')}</strong>까지는 <br />
                모든 프리미엄 혜택을 계속 이용할 수 있습니다.
              </p>
              
              <div className="w-full flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  className="w-full bg-error hover:bg-error/90 border-error py-4"
                  onClick={handleConfirm}
                  isLoading={isPending}
                >
                  네, 구독을 취소하겠습니다
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full py-4 text-on-surface-variant"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  아니오, 유지하겠습니다
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
