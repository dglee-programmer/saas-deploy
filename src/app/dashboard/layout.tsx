import React from 'react';
import { Sidebar } from './_components/Sidebar';
import { getDashboardData } from '@/app/actions/note.actions';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPremium } = await getDashboardData();
  
  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex">
      <Sidebar isPremium={isPremium} />
      <div className="flex-1 flex flex-col ml-64">
        {children}
      </div>
    </div>
  );
}
