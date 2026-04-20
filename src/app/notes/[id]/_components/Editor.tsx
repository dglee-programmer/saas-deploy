'use client'

import React, { useState, useEffect, useTransition } from 'react';
import { updateNoteAction, deleteNoteAction } from '@/app/actions/note.actions';
import { useDebounce } from '@/hooks/useDebounce';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface Note {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export function Editor({ initialNote }: { initialNote: Note }) {
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const debouncedNote = useDebounce(note, 1000);

  useEffect(() => {
    if (debouncedNote.id && (debouncedNote.title !== initialNote.title || debouncedNote.content !== initialNote.content)) {
      handleSave();
    }
  }, [debouncedNote]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNoteAction({
        id: note.id,
        title: note.title,
        content: note.content
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isNewNote = (note.title === '제목 없는 메모' || !note.title) && note.content === '';

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      startTransition(async () => {
        await deleteNoteAction(note.id);
        window.location.href = '/dashboard';
      });
    }
  };

  const handleCancel = () => {
    // If it's a brand new empty note, delete it and go back
    startTransition(async () => {
      await deleteNoteAction(note.id);
      window.location.href = '/dashboard';
    });
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      await updateNoteAction({
        id: note.id,
        title: note.title,
        content: note.content
      });
      // Small delay for saving feedback before redirecting
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      setIsSaving(false);
    }
  };

  const handleContentChange = (content: string) => {
    // Basic word count calculation for immediate UI feel
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setNote({ ...note, content, wordCount: words });
  };

  return (
    <main className="flex-1 flex flex-col relative bg-surface">
      {/* Toolbar */}
      <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          <Button variant="ghost" size="icon" className="p-1.5 h-9 w-9" title="굵게">
            <Icon name="format_bold" className="text-on-surface-variant group-hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1.5 h-9 w-9" title="기울임꼴">
            <Icon name="format_italic" className="text-on-surface-variant group-hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1.5 h-9 w-9" title="리스트">
            <Icon name="format_list_bulleted" className="text-on-surface-variant group-hover:text-primary" />
          </Button>
          <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
          <Button variant="ghost" size="icon" className="p-1.5 h-9 w-9" title="이미지 추가">
            <Icon name="add_photo_alternate" className="text-on-surface-variant group-hover:text-primary" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          {isNewNote ? (
            <Button 
              variant="ghost"
              size="md"
              onClick={handleCancel}
              isLoading={isPending}
              leftIcon="close"
            >
              취소
            </Button>
          ) : (
            <Button 
              variant="ghost"
              size="md"
              onClick={handleDelete}
              isLoading={isPending}
              leftIcon="delete"
              className="text-error hover:text-error"
            >
              삭제
            </Button>
          )}
          <Button 
            variant="primary"
            size="md"
            onClick={handleSaveAndExit}
            isLoading={isSaving}
            leftIcon="save"
            className="shadow-lg shadow-primary/20"
          >
            저장 및 닫기
          </Button>
        </div>
      </header>

      {/* Editor Canvas */}
      <div className="flex-1 px-8 lg:px-24 xl:px-48 py-12 max-w-6xl mx-auto w-full">
        <div className="space-y-8">
          <div className="relative group">
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-4xl lg:text-5xl font-black font-headline tracking-tight text-on-surface placeholder:text-surface-dim p-0"
              placeholder="제목을 입력하세요..."
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/10">
              <span className="text-xs font-medium text-on-surface-variant">본인</span>
            </div>
            <div className="text-xs font-medium text-outline flex items-center space-x-1">
              <Icon name="schedule" size={14} />
              <span>방금 전 수정됨</span>
            </div>
          </div>

          <div className="relative min-h-[500px]">
            <textarea
              className="w-full h-full min-h-[500px] bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-on-surface-variant placeholder:text-surface-dim p-0 resize-none font-body"
              placeholder="생각을 이곳에 입력하기 시작하세요..."
              value={note.content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer Toolbar */}
      <footer className="sticky bottom-0 px-8 py-4 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-on-secondary-container">
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide">저장 중...</span>
              </div>
            ) : (
              <span className="text-xs font-semibold tracking-wide text-on-surface-variant">저장됨</span>
            )}
          </div>
          <div className="h-4 w-px bg-outline-variant/30"></div>
          <div className="text-xs text-on-surface-variant font-medium">
            <span className="text-primary font-bold">{note.wordCount}</span> 단어
          </div>
        </div>
        <div className="flex items-center space-x-4 text-outline">
          <Button variant="ghost" size="sm" className="h-8 px-2 font-bold" leftIcon="visibility">
            미리보기
          </Button>
        </div>
      </footer>
    </main>
  );
}
