import React from 'react';
import { Header } from '../_components/Header';
import { getDashboardData } from '@/app/actions/note.actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function RecentNotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { notes, user } = await getDashboardData(q);
  
  if (!user) {
    redirect('/auth');
  }

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface">최근 항목</h1>
            <p className="text-on-surface-variant font-medium mt-1">가장 최근에 작업한 메모들을 확인하세요.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>마지막 업데이트 순</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Link 
                key={note.id} 
                href={`/notes/${note.id}`}
                className="group relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-48"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">방금 전</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {note.title || '제목 없는 메모'}
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body leading-relaxed flex-grow">
                  {note.content || '내용이 없습니다.'}
                </p>
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">자세히 보기</span>
                  <span className="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-surface-container-low/50 rounded-3xl border-2 border-dashed border-outline-variant/20">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant">history</span>
              </div>
              <div>
                <p className="text-on-surface-variant font-bold">최근 항목이 없습니다.</p>
                <p className="text-sm text-outline">새로운 메모를 작성하여 기록을 시작하세요.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
