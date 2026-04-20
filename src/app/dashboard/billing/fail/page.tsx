import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { updatePaymentStatusAction } from "@/app/actions/billing.actions";

const ERROR_MAP: Record<string, { title: string; steps: string[] }> = {
  INVALID_CARD_NUMBER: {
    title: "카드 번호 오류",
    steps: ["카드 번호 16자리가 정확한지 확인해 주세요.", "카드 뒷면의 유효기간(월/년)을 다시 확인해 주세요."]
  },
  REJECT_CARD_COMPANY: {
    title: "카드사 거절",
    steps: ["보유하신 카드의 한도가 초과되었는지 확인해 주세요.", "온라인 결제가 제한된 카드인지 카드사에 문의해 주세요."]
  },
  PAY_PROCESS_CANCELED: {
    title: "결제 취소됨",
    steps: ["결제 창을 직접 닫으셨거나 취소하셨습니다.", "재시도 버튼을 눌러 다시 결제를 진행해 주세요."]
  },
  EXCEED_MAX_DAILY_PAYMENT_COUNT: {
    title: "일일 한도 초과",
    steps: ["해당 카드의 하루 결제 횟수 제한을 초과했습니다.", "다른 카드를 사용하거나 카드사에 한도 조정을 요청해 주세요."]
  },
  REJECT_ACCOUNT_PASSWORD_INVALID: {
    title: "비밀번호 오류",
    steps: ["입력하신 카드 비밀번호 정보가 일치하지 않습니다.", "인증 수단(SMS, 앱카드 등) 정보를 다시 확인해 주세요."]
  },
  INVALID_UNSECURED_PAYMENT_UNAVAILABLE: {
    title: "해외결제 제한",
    steps: ["해당 카드가 해외/온라인 결제가 차단되어 있는지 확인해 주세요.", "카드사 앱에서 해외 결제 설정을 확인해 보세요."]
  }
};

export default async function FailPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const message = (params.message as string) || "알 수 없는 오류가 발생했습니다.";
  const code = params.code as string;
  const orderId = params.orderId as string;

  if (orderId) {
    try {
      await updatePaymentStatusAction(orderId, 'FAILED', message || code);
    } catch (e) {
      console.error("Failed to log payment error status");
    }
  }

  const errorDetail = ERROR_MAP[code] || {
    title: "결제 처리 실패",
    steps: ["일시적인 네트워크 오류일 수 있습니다.", "잠시 후 다시 시도해 주세요."]
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs for Premium Feel */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-error/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center space-y-8 relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-error/10 flex items-center justify-center text-error mx-auto rotate-12 shadow-inner">
          <Icon name="error" size={56} filled className="-rotate-12" />
        </div>
        
        <div className="space-y-3">
          <h1 className="font-headline text-3xl font-black text-on-surface tracking-tight">
            {errorDetail.title}
          </h1>
          <p className="text-on-surface-variant font-medium px-4 leading-relaxed">
            카드 정보를 처리하는 도중 문제가 생겼습니다.<br/>아래 가이드를 확인해 주세요.
          </p>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-surface-container-low/50 rounded-3xl p-6 text-left border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2 text-error">
            <Icon name="info" size={18} filled />
            <span className="text-sm font-bold tracking-tight">확인 및 해결 방법</span>
          </div>
          
          <ul className="space-y-3">
            {errorDetail.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-error/10 text-error text-[10px] flex items-center justify-center flex-shrink-0 font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm text-on-surface font-medium leading-tight">{step}</p>
              </li>
            ))}
          </ul>

          <div className="pt-2 mt-2 border-t border-dashed border-outline-variant/30 flex justify-between items-center opacity-60">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Error Detail</span>
            <span className="text-[10px] font-mono text-outline-variant truncate max-w-[200px]">
              {code}: {message}
            </span>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full shadow-lg shadow-primary/20" 
            href="/dashboard/billing"
            leftIcon="refresh"
          >
            카드 다시 등록하기
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full text-on-surface-variant opacity-70 hover:opacity-100" 
            href="/dashboard"
          >
            나중에 하기
          </Button>
        </div>
      </div>
    </div>
  );
}
