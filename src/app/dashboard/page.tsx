import React from 'react';
import type { Metadata } from 'next';
import { Header } from './_components/Header';
import { getDashboardData } from '@/app/actions/note.actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "내 대시보드",
};
import { Sidebar } from './_components/Sidebar';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { notes, profile, isPremium } = await getDashboardData(q);
  
  if (!profile) {
    redirect('/auth');
  }

  const userName = profile.full_name || '사용자';

  return (
    <div className="flex flex-col">
      <Header />
      
      <section className="px-8 pb-20 max-w-6xl mx-auto">
        {/* Hero Greeting */}
        <div className="mb-12 mt-4">
          <h2 className="font-manrope text-5xl font-extrabold tracking-tight text-on-surface mb-2">반가워요, {userName}님</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            {isPremium 
              ? `디지털 큐레이션 공간이 준비되었습니다. 최근 내역에 ${notes.length}개의 메모가 있습니다.`
              : 'anynote의 모든 기능을 사용하려면 프리미엄 멤버십 구독이 필요합니다.'}
          </p>
        </div>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative">
          {!isPremium && (
            <div className="absolute inset-0 z-20 bg-surface/40 backdrop-blur-[2px] rounded-[40px] flex items-center justify-center p-6">
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl border border-outline-variant/10 text-center space-y-8 max-w-xl animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                  <Icon name="lock" size={56} filled />
                </div>
                <div className="space-y-3">
                  <h2 className="font-headline text-3xl font-bold text-on-surface">기능이 제한되었습니다</h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    프리미엄 멤버십을 구독하시면 무제한 메모 작성, 스마트 AI 검색 등 <span className="text-primary font-bold">anynote</span>의 강력한 모든 기능을 자유롭게 이용하실 수 있습니다.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="primary" size="lg" className="px-12 py-7 shadow-xl shadow-primary/20 text-lg" href="/dashboard/billing">
                    지금 구독하고 바로 시작하기
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Memos Container */}
          <div className={cn("md:col-span-8 space-y-6", !isPremium && "opacity-40 grayscale-[0.5] pointer-events-none")}>
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="font-manrope text-xl font-bold">최근 메모</h3>
              <Button variant="text" size="sm" href="/dashboard/recent" className="font-semibold">모두 보기</Button>
            </div>

            {/* Memo Cards */}
            <div className="grid grid-cols-1 gap-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="group bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest uppercase text-outline">
                          {note.tags[0] || '일반 메모'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-outline-variant/70 bg-surface-container-low px-2 py-1 rounded-md">
                        {new Date(note.updatedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <Link href={`/notes/${note.id}`} className="block group/title">
                      <h4 className="font-headline text-xl font-bold mb-3 text-on-surface group-hover/title:text-primary transition-colors line-clamp-1">
                        {note.title || '제목 없는 메모'}
                      </h4>
                    </Link>
                    
                    <p className="text-on-surface-variant/80 text-sm leading-relaxed line-clamp-2 font-body h-10">
                      {note.content || '기록된 내용이 없습니다.'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-surface-container-lowest rounded-xl border-dashed border-2 border-outline-variant/30">
                  <p className="text-on-surface-variant">표시할 메모가 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Sidebar Stats/Quick Actions */}
          <div className={cn("md:col-span-4 space-y-6", !isPremium && "opacity-40 grayscale-[0.5] pointer-events-none")}>
            {/* Statistics Panel */}
            <div className="bg-surface-container-low p-6 rounded-xl border-none">
              <h3 className="font-manrope font-bold text-lg mb-6">큐레이션 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">사용 중인 용량</span>
                  <span className="text-sm font-bold text-primary">0%</span>
                </div>
                <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[0%] rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-black text-on-surface">{notes.length}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">전체 메모</div>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-black text-on-surface">0</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">공유됨</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(25,27,35,0.06)] border border-outline-variant/10">
              <h3 className="font-manrope font-bold text-sm text-on-surface-variant uppercase tracking-widest mb-4">빠른 도구</h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="ghost" className="w-full justify-start h-10 px-2" leftIcon="cloud_upload">
                    Notion에서 가져오기
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start h-10 px-2" leftIcon="picture_as_pdf">
                    PDF로 내보내기
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
