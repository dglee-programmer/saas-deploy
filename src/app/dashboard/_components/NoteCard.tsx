'use client'

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { generateNoteUrl } from '@/lib/utils';
import { togglePinNoteAction } from '@/app/actions/note.actions';

interface NoteCardNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

interface NoteCardProps {
  note: NoteCardNote;
  /** 'list' for dashboard row style, 'grid' for card grid style */
  variant?: 'list' | 'grid';
}

export function NoteCard({ note, variant = 'list' }: NoteCardProps) {
  const plainText = note.content
    ? note.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
    : '';
  const imgMatch = note.content
    ? note.content.match(/<img[^>]+src="([^">]+)"/)
    : null;
  const thumbnailUrl = imgMatch ? imgMatch[1] : null;

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 클릭 방지
    e.stopPropagation();
    await togglePinNoteAction(note.id);
  };

  if (variant === 'grid') {
    return (
      <Link
        href={generateNoteUrl(note.id, note.title)}
        className="group relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-56 outline-none cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon name={note.isPinned ? 'keep' : 'description'} filled={note.isPinned} size={20} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-lg transition-all ${
                note.isPinned
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-outline-variant/50 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-primary/5'
              }`}
              title={note.isPinned ? '고정 해제' : '메모 고정'}
            >
              <Icon name="keep" size={16} filled={note.isPinned} />
            </button>
            <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">
              {new Date(note.updatedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-grow min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {note.title || '제목 없는 메모'}
            </h3>
            <p className="text-on-surface-variant text-sm line-clamp-2 font-body leading-relaxed flex-grow break-all overflow-hidden text-ellipsis">
              {plainText || '내용이 없습니다.'}
            </p>
          </div>
          {thumbnailUrl && (
            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm bg-surface-container-low mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnailUrl} alt="첨부 이미지 썸네일" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">자세히 보기</span>
          <Icon name="arrow_forward" size={14} className="text-primary" />
        </div>
      </Link>
    );
  }

  // Default: list variant (dashboard style)
  return (
    <Link href={generateNoteUrl(note.id, note.title)} className="block outline-none">
      <div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {note.tags.length > 0 ? (
              note.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black tracking-widest uppercase text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-black tracking-widest uppercase text-outline">
                일반 메모
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-lg transition-all ${
                note.isPinned
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-outline-variant/50 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-primary/5'
              }`}
              title={note.isPinned ? '고정 해제' : '메모 고정'}
            >
              <Icon name="keep" size={16} filled={note.isPinned} />
            </button>
            <span className="text-[10px] font-bold text-outline-variant/70 bg-surface-container-low px-2 py-1 rounded-md">
              {new Date(note.updatedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
            </span>
          </div>
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
}
