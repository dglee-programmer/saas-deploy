import React from 'react';
import type { Metadata } from 'next';
import { getNoteAction } from '@/app/actions/note.actions';
import { Editor } from './_components/Editor';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteAction(id);

  if (!note) {
    return {
      title: "메모를 찾을 수 없습니다",
    };
  }

  return {
    title: note.title || '제목 없는 메모',
    description: note.content ? `${note.content.substring(0, 100)}...` : '기록된 내용이 없습니다.',
    openGraph: {
      title: `${note.title || '제목 없는 메모'} | anynote`,
      description: note.content ? `${note.content.substring(0, 100)}...` : '기록된 내용이 없습니다.',
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  const note = await getNoteAction(id);

  if (!note) {
    // For demo/design verification, if note doesn't exist in Supabase (which is likely now),
    // we return a mock note so the user can see the UI.
    const mockNote = {
      id,
      title: '분기별 아키텍처 리뷰',
      content: '엔지니어링 팀의 합의에 따라 다음 단계에서는 마이크로 프론트엔드 아키텍처로 전환할 것을 제안합니다. 관련 우려 사항으로는...',
      wordCount: 15
    };
    return <Editor initialNote={mockNote} />;
  }

  return (
    <Editor 
      initialNote={{
        id: note.id,
        title: note.title,
        content: note.content || '',
        wordCount: note.wordCount
      }} 
    />
  );
}
