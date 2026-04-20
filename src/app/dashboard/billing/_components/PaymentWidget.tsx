'use client'

import { useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/Button";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

interface PaymentWidgetProps {
  customerKey: string; // 유저 고유 ID (인증 세션에서 전달받음)
  orderId: string;
  orderName: string;
}

export function PaymentWidget({ customerKey, orderId, orderName }: PaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterCard = async () => {
    try {
      setIsLoading(true);
      
      // 1. 토스페이먼츠 인스턴스 초기화
      const tossPayments = await loadTossPayments(clientKey);
      
      // 2. 결제창 인스턴스 생성
      const payment = tossPayments.payment({ customerKey });

      // 3. 빌링키 발급(카드 등록) 요청
      await payment.requestBillingAuth({
        method: "CARD", // 카드 등록 방식 고정
        successUrl: window.location.origin + "/dashboard/billing/success",
        failUrl: window.location.origin + "/dashboard/billing/fail",
      });
    } catch (error: any) {
      console.error("Card registration request failed:", error);
      alert(error.message || "카드 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-outline-variant/10 shadow-xl space-y-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary">
          <span className="material-symbols-rounded text-3xl">add_card</span>
        </div>
        <div>
          <h4 className="text-xl font-bold text-on-surface">카드 등록 및 구독 시작</h4>
          <p className="text-sm text-on-surface-variant">매월 5,000원이 자동으로 결제됩니다.</p>
        </div>
      </div>

      <div className="p-4 bg-surface-container-low rounded-2xl space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-outline">상품명</span>
          <span className="font-bold text-on-surface">{orderName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-outline">최초 결제 금액</span>
          <span className="font-bold text-on-surface">5,000원</span>
        </div>
        <div className="flex justify-between text-xs pt-2 border-t border-outline-variant/10">
          <span className="text-outline">결제 예정일</span>
          <span className="font-bold text-primary">즉시 결제 후 매월 30일 주기</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-lg shadow-primary/20"
          onClick={handleRegisterCard}
          isLoading={isLoading}
          leftIcon="payments"
        >
          결제 카드 등록하기
        </Button>
        <p className="text-[10px] text-center text-on-surface-variant/60">
          토스페이먼츠의 보안 기술로 카드 정보를 안전하게 보호합니다.
        </p>
      </div>
    </div>
  );
}
