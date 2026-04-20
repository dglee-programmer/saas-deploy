import React from 'react';
import { Sidebar } from '../dashboard/_components/Sidebar';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        {children}
      </div>
    </div>
  );
}
