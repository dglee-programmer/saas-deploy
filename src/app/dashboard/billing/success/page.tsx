import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { issueBillingKeyAction } from "@/app/actions/billing.actions";
import { RedirectAfterDelay } from "./_components/RedirectAfterDelay";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const authKey = params.authKey as string;
  const customerKey = params.customerKey as string;
  
  let error: string | null = null;
  let isSuccess = false;

  if (authKey && customerKey) {
    try {
      await issueBillingKeyAction(authKey, customerKey);
      isSuccess = true;
    } catch (err: any) {
      error = err.message || "빌링키 발급 및 첫 결제 중 오류가 발생했습니다.";
    }
  } else {
    error = "필수 결제 정보가 누락되었습니다.";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-outline-variant/10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center text-error mx-auto">
            <Icon name="error" size={48} filled />
          </div>
          <h1 className="font-headline text-2xl font-black text-on-surface">승인 실패</h1>
          <p className="text-on-surface-variant">{error}</p>
          <div className="pt-4">
            <Button variant="primary" size="lg" className="w-full" href="/dashboard/billing">
              다시 시도하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-outline-variant/10 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
          <Icon name="check_circle" size={48} filled />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-black text-on-surface">결제 성공!</h1>
          <p className="text-on-surface-variant font-medium">프리미엄 멤버십 가입이 완료되었습니다.</p>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 text-left space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between text-xs">
            <span className="text-outline">멤버십 유형</span>
            <span className="font-bold text-on-surface">프리미엄 (정기결제)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-outline">결제 주차</span>
            <span className="font-bold text-on-surface">매월 30일</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full" 
            href="/dashboard"
          >
            대시보드로 이동
          </Button>
          <RedirectAfterDelay delay={3000} to="/dashboard" />
          <p className="text-[10px] text-primary animate-pulse">
            잠시 후 대시보드로 자동 이동합니다...
          </p>
        </div>
      </div>
    </div>
  );
}
