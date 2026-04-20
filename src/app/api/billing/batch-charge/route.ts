import { NextResponse } from 'next/server';
import { processBatchChargeAction } from '@/app/actions/billing.actions';

export async function GET(request: Request) {
  // 보안: Vercel Cron 환경에서만 실행되도록 체크
  // 로컬 테스트를 위해 잠시 주석 처리할 수 있지만, 운영 시에는 필수입니다.
  const authHeader = request.headers.get('authorization');
  
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processBatchChargeAction();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
