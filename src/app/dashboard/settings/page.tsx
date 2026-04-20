import React from 'react';
import { Header } from '../_components/Header';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/app/actions/auth.actions';
import { ProfileForm } from './_components/ProfileForm';

export default async function SettingsPage() {
  const user = await getUserSession();
  
  if (!user) {
    redirect('/auth');
  }

  const initialName = user?.user_metadata?.full_name || '';
  const email = user?.email || '';

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="font-headline text-4xl font-black text-on-surface tracking-tight">설정</h1>
          <p className="text-on-surface-variant font-medium mt-2">워크스페이스 환경과 개인 정보를 관리합니다.</p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-lg">account_circle</span>
            개인 프로필
          </div>
          <ProfileForm initialName={initialName} email={email} />
        </section>

        <section className="space-y-6 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">tune</span>
            고급 설정 (준비 중)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl text-outline">dark_mode</span>
              <div>
                <p className="font-bold text-sm">다크 모드</p>
                <p className="text-xs text-outline">시스템 기본값</p>
              </div>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl text-outline">language</span>
              <div>
                <p className="font-bold text-sm">기본 언어</p>
                <p className="text-xs text-outline">한국어 (Default)</p>
              </div>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl text-outline">notifications</span>
              <div>
                <p className="font-bold text-sm">알림 설정</p>
                <p className="text-xs text-outline">이메일 알림 활성화</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
