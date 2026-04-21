import React from 'react';
import type { Metadata } from 'next';
import { Header } from './_components/Header';
import { getDashboardData } from '@/app/actions/note.actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn, generateNoteUrl } from '@/lib/utils';

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
      <Sidebar 
        isPremium={isPremium} 
        folders={profile.folders || []} 
        noteCount={notes.length}
        storageUsed={profile.storage_used || 0}
      />
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
          {/* Conditional Limit Overlay (PM approach: only block when over limit) */}
          {!isPremium && (notes.length >= 30 || (profile.storage_used || 0) >= 10 * 1024 * 1024) && (
            <div className="absolute inset-0 z-20 bg-surface/60 backdrop-blur-[4px] rounded-[40px] flex items-center justify-center p-6">
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl border border-primary/20 text-center space-y-8 max-w-xl animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-error-container/10 rounded-3xl flex items-center justify-center text-error mx-auto">
                  <Icon name="warning" size={56} filled />
                </div>
                <div className="space-y-3">
                  <h2 className="font-headline text-3xl font-bold text-on-surface">무료 등급 한도 초과</h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    현재 메모 수 또는 저장 용량이 무료 등급 한도를 초과했습니다.<br/>
                    계속해서 아이디어를 확장하시려면 <span className="text-primary font-bold">anynote 프리미엄</span>으로 업그레이드하세요.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="primary" size="lg" className="px-12 py-7 shadow-xl shadow-primary/20 text-lg" href="/dashboard/billing">
                    프리미엄 요금제 보기
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Memos Container */}
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="font-manrope text-xl font-bold">최근 메모</h3>
              <Button variant="text" size="sm" href="/dashboard/recent" className="font-semibold">모두 보기</Button>
            </div>

            {/* Memo Cards */}
            <div className="grid grid-cols-1 gap-4">
              {notes.length > 0 ? (
                notes.map((note) => {
                  const plainText = note.content ? note.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : '';
                  const imgMatch = note.content ? note.content.match(/<img[^>]+src="([^">]+)"/) : null;
                  const thumbnailUrl = imgMatch ? imgMatch[1] : null;
                  
                  return (
                    <Link key={note.id} href={generateNoteUrl(note.id, note.title)} className="block outline-none">
                      <div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
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
                        
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-headline text-xl font-bold mb-2 text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                              {note.title || '제목 없는 메모'}
                            </h4>
                            <p className="text-on-surface-variant/80 text-sm leading-relaxed line-clamp-2 font-body break-all overflow-hidden text-ellipsis min-h-[40px]">
                              {plainText || '기록된 내용이 없습니다.'}
                            </p>
                          </div>
                          
                          {thumbnailUrl && (
                            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm bg-surface-container-low mt-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={thumbnailUrl} alt="첨부 이미지 썸네일" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-surface-container-lowest rounded-xl border-dashed border-2 border-outline-variant/30">
                  <p className="text-on-surface-variant">표시할 메모가 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Sidebar Stats/Quick Actions */}
          <div className="md:col-span-4 space-y-6">
            {/* Statistics Panel */}
            <div className="bg-surface-container-low p-6 rounded-xl border-none">
              <h3 className="font-manrope font-bold text-lg mb-6">큐레이션 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">사용 중인 용량</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(((profile.storage_used || 0) / (10 * 1024 * 1024)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", 
                      (profile.storage_used || 0) > 8 * 1024 * 1024 ? "bg-error" : "bg-primary")}
                    style={{ width: `${Math.min(100, Math.round(((profile.storage_used || 0) / (10 * 1024 * 1024)) * 100))}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-black text-on-surface">
                      {notes.length}
                      {!isPremium && <span className="text-xs text-on-surface-variant ml-1">/ 30</span>}
                    </div>
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
