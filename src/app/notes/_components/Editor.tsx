'use client'

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { updateNoteAction, deleteNoteAction } from '@/app/actions/note.actions';
import { useDebounce } from '@/hooks/useDebounce';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TagInput } from './TagInput';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface Note {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  tags: string[];
}

export function Editor({ initialNote }: { initialNote: Note }) {
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const debouncedNote = useDebounce(note, 1000);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg border border-outline-variant/10 shadow-sm max-w-full h-auto my-6',
        },
      }),
      Placeholder.configure({
        placeholder: '생각을 이곳에 입력하기 시작하세요...',
      }),
    ],
    content: initialNote.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-lg leading-relaxed text-on-surface-variant font-body',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setNote(prev => ({ ...prev, content: html, wordCount: words }));
    },
  });

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

  const isNewNote = (note.title === '제목 없는 메모' || !note.title) && (note.content === '' || note.content === '<p></p>');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setIsDeleting(true);
    try {
      const result = await deleteNoteAction(note.id);
      if (result && !result.success) {
        alert('삭제에 실패했습니다: ' + result.error);
        setIsDeleting(false);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      alert('삭제 처리 중 오류 발생: ' + err.message);
      setIsDeleting(false);
    }
  };

  const handleCancel = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteNoteAction(note.id);
      if (result && !result.success) {
        alert('삭제에 실패했습니다: ' + result.error);
        setIsDeleting(false);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      alert('삭제 처리 중 오류 발생: ' + err.message);
      setIsDeleting(false);
    }
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await updateNoteAction({
        id: note.id,
        title: note.title,
        content: note.content
      });
      // 저장 성공 시 대시보드로 이동
      router.push('/dashboard');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      setIsSaving(false); // 에러 발생 시에만 저장 중 상태를 해제하여, 이동 중에는 로딩 상태가 유지되게 함
    }
  };

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        
        // Client-side validation: 1MB
        if (file.size > 1 * 1024 * 1024) {
          alert('이미지 용량은 1MB를 초과할 수 없습니다.');
          return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || '업로드 실패');
          }

          if (result.url && editor) {
            console.log('[Editor] Inserting image into body:', result.url);
            
            // Tiptap insertion: ensure focus and a block-level insertion
            editor.chain().focus().insertContent([
              {
                type: 'image',
                attrs: {
                  src: result.url,
                  alt: file.name || 'uploaded image',
                  title: file.name
                }
              },
              {
                type: 'paragraph' // Add an empty paragraph after the image for easier editing
              }
            ]).run();
          }
        } catch (error: any) {
          alert(error.message);
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  }, [editor]);

  if (!mounted || !editor) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col relative bg-surface">
      {/* Toolbar */}
      <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`p-1.5 h-9 w-9 ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}`} 
            title="굵게"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Icon name="format_bold" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`p-1.5 h-9 w-9 ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}`} 
            title="기울임꼴"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Icon name="format_italic" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`p-1.5 h-9 w-9 ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}`} 
            title="리스트"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <Icon name="format_list_bulleted" />
          </Button>
          <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 h-9 w-9" 
            title="이미지 추가"
            onClick={addImage}
            isLoading={isUploading}
          >
            <Icon name="add_photo_alternate" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          {isNewNote ? (
            <Button variant="ghost" size="md" onClick={handleCancel} isLoading={isDeleting} leftIcon="close">취소</Button>
          ) : (
            <Button variant="ghost" size="md" onClick={handleDelete} isLoading={isDeleting} leftIcon="delete" className="text-error hover:text-error">삭제</Button>
          )}
          <Button variant="primary" size="md" onClick={handleManualSave} isLoading={isSaving} leftIcon="save" className="shadow-lg shadow-primary/20">저장</Button>
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

          <TagInput noteId={note.id} initialTags={note.tags} />
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/10">
              <span className="text-xs font-medium text-on-surface-variant">본인</span>
            </div>
            <div className="text-xs font-medium text-outline flex items-center space-x-1">
              <Icon name="schedule" size={14} />
              <span>방금 전 수정됨</span>
            </div>
          </div>

          <div className="relative min-h-[500px] editor-canvas">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Footer Toolbar */}
      <footer className="sticky bottom-0 px-8 py-4 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-xs font-semibold tracking-wide text-on-secondary-container flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="animate-ping h-2 w-2 rounded-full bg-primary opacity-75"></span>
                저장 중...
              </span>
            ) : "저장됨"}
          </div>
          <div className="h-4 w-px bg-outline-variant/30"></div>
          <div className="text-xs text-on-surface-variant font-medium">
            <span className="text-primary font-bold">{note.wordCount}</span> 단어
          </div>
        </div>
        <div className="flex items-center space-x-4 text-outline">
          <Button variant="ghost" size="sm" className="h-8 px-2 font-bold" leftIcon="visibility">미리보기</Button>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl p-8 shadow-2xl border border-outline-variant/10 max-w-sm w-full animate-in zoom-in-95 fade-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-6">
                <Icon name="delete_forever" size={32} />
              </div>
              <h2 className="text-2xl font-bold font-headline text-on-surface mb-3">메모를 삭제할까요?</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                삭제된 메모는 다시 복구할 수 없습니다.<br/>정말로 이 메모를 삭제하시겠습니까?
              </p>
              <div className="flex w-full gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-xl h-12 font-bold" 
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  취소
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 bg-error hover:bg-error/90 text-white rounded-xl h-12 font-bold border-none shadow-lg shadow-error/20" 
                  onClick={confirmDelete}
                >
                  삭제하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
