import React from 'react';
import type { Metadata } from 'next';
import { getNoteAction } from '@/app/actions/note.actions';
import { Editor } from './_components/Editor';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id } = await searchParams;
  
  if (!id) return { title: 'Not Found' };
  
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

export default async function NotePage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  
  if (!id) {
    redirect('/dashboard');
  }

  const note = await getNoteAction(id);

  if (!note) {
    notFound();
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
