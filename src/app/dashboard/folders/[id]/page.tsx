import React from 'react';
import { Header } from '@/app/dashboard/_components/Header';
import { getFolderNotesAction } from '@/app/actions/folder.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateNoteUrl } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FolderPage({ params }: PageProps) {
  const { id } = await params;
  const notes = await getFolderNotesAction(id);

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="px-8 pb-20 max-w-6xl mx-auto">
        <div className="mb-12 mt-4">
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <span className="material-symbols-outlined">folder_open</span>
            <h2 className="font-manrope text-sm uppercase tracking-widest">폴더 컬렉션</h2>
          </div>
          <h1 className="font-manrope text-5xl font-extrabold tracking-tight text-on-surface mb-2">
            폴더 결과
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            이 폴더에는 현재 {notes.length}개의 메모가 저장되어 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {notes.length > 0 ? (
                notes.map((note) => {
                  const plainText = note.content ? note.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : '';
                  const imgMatch = note.content ? note.content.match(/<img[^>]+src="([^">]+)"/) : null;
                  const thumbnailUrl = imgMatch ? imgMatch[1] : null;

                  return (
                    <Link key={note.id} href={generateNoteUrl(note.id, note.title)} className="block outline-none">
                      <div className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(25,27,35,0.06)] border border-outline-variant/10 hover:translate-y-[-2px] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-secondary-container/30 text-secondary text-[10px] font-bold tracking-widest uppercase rounded-full">
                            {note.tags[0] || '일반'}
                          </span>
                          <span className="text-on-surface-variant/50 text-xs font-medium">
                            {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-manrope text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{note.title || '제목 없는 메모'}</h4>
                            <p className="text-on-surface-variant/80 text-sm leading-relaxed line-clamp-2 break-all overflow-hidden text-ellipsis min-h-[40px]">
                              {plainText || '내용이 없습니다.'}
                            </p>
                          </div>
                          
                          {thumbnailUrl && (
                            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm bg-surface-container-low">
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
                <div className="text-center py-32 bg-surface-container-lowest rounded-xl border-dashed border-2 border-outline-variant/30 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4">folder_off</span>
                  <p className="text-on-surface-variant font-medium">이 폴더는 비어 있습니다.</p>
                  <Link href="/dashboard" className="mt-4 text-primary font-bold text-sm hover:underline">모든 메모로 돌아가기</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
