'use client'

import React, { useEffect, useState } from 'react';
import { createNewNoteAction } from '@/app/actions/note.actions';
import { logoutAction } from '@/app/actions/auth.actions';
import { getFoldersAction, createFolderAction } from '@/app/actions/folder.actions';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface Folder {
  id: string;
  name: string;
}

export function Sidebar({ isPremium = false, folders = [] }: { isPremium?: boolean, folders?: Folder[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolderToggle = () => {
    setIsCreatingFolder(true);
    setNewFolderName('');
  };

  const handleSaveInline = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newFolderName.trim()) {
      try {
        await createFolderAction(newFolderName.trim());
        setIsCreatingFolder(false);
        setNewFolderName('');
        router.refresh(); // Refresh layout data
      } catch (error: any) {
        alert(`폴더 생성 중 오류가 발생했습니다: ${error.message || error}`);
      }
    }
  };

  const handleCancelInline = () => {
    setIsCreatingFolder(false);
    setNewFolderName('');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 space-y-2 font-inter text-sm font-medium tonal-shift z-40 border-r border-slate-200/50">
      <div className="px-2 py-4 mb-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="description" filled className="text-white text-2xl" />
          </div>
          <span className="font-manrope font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-50">anynote</span>
        </Link>
        <div className="flex items-center gap-1.5 mt-1.5 pl-1">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
            isPremium ? "bg-primary/10 text-primary" : "bg-outline-variant/30 text-outline"
          )}>
            {isPremium ? 'Premium Plan' : 'Free Plan'}
          </span>
        </div>
      </div>

      <form action={createNewNoteAction}>
        <Button 
          variant="primary" 
          className={cn("w-full mb-6 py-6", !isPremium && "opacity-60 cursor-not-allowed")}
          leftIcon={isPremium ? "add" : "lock"}
          disabled={!isPremium}
        >
          {isPremium ? '새 메모 작성' : '구독 후 작성 가능'}
        </Button>
      </form>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        <Button
          variant={isActive('/dashboard') ? 'primary' : 'ghost'}
          href="/dashboard"
          className={cn(
            "w-full justify-start h-10 px-4",
            isActive('/dashboard') ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200/50 hover:bg-white" : ""
          )}
          leftIcon="description"
          leftIconFilled={isActive('/dashboard')}
        >
          모든 메모
        </Button>
        
        <div className="pt-2">
          <div className="flex items-center justify-between px-4 py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <span>폴더</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-5 h-5 rounded-full" 
              onClick={isPremium ? handleCreateFolderToggle : undefined}
              title={isPremium ? "새 폴더 만들기" : "구독이 필요합니다"}
              disabled={!isPremium}
            >
              <Icon name={isPremium ? "add" : "lock"} size={14} />
            </Button>
          </div>
          <div className="space-y-1 mt-1">
            {isCreatingFolder && (
              <div className="px-4 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <form onSubmit={handleSaveInline}>
                  <div className="relative group">
                    <input 
                      autoFocus
                      className="w-full bg-white dark:bg-slate-800 border-2 border-primary/30 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary transition-all shadow-sm"
                      placeholder="폴더 이름..."
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCancelInline();
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button type="submit" className="text-primary hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </button>
                      <button type="button" onClick={handleCancelInline} className="text-slate-400 hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 pl-1 font-semibold uppercase tracking-tighter">Enter 저장 • Esc 취소</p>
                </form>
              </div>
            )}
            {folders.length > 0 ? (
              folders.map(folder => (
                <Button
                  key={folder.id}
                  href={`/dashboard/folders/${folder.id}`}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-9 px-4",
                    isActive(`/dashboard/folders/${folder.id}`) ? "text-primary font-bold bg-primary/5" : "text-on-surface-variant"
                  )}
                  leftIcon="folder"
                  leftIconFilled={isActive(`/dashboard/folders/${folder.id}`)}
                >
                  {folder.name}
                </Button>
              ))
            ) : (
              <div className="px-8 py-2 text-xs text-slate-400 italic">폴더가 없습니다</div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/30">
          <Button variant="ghost" className="w-full justify-start h-10 px-4 text-slate-500 dark:text-slate-400" href="/dashboard/recent" leftIcon="history">
            최근 항목
          </Button>
          <Button variant="ghost" className="w-full justify-start h-10 px-4 text-slate-500 dark:text-slate-400" href="/dashboard/billing" leftIcon="payments">
            결제 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start h-10 px-4 text-slate-500 dark:text-slate-400" href="/dashboard/settings" leftIcon="settings">
            설정
          </Button>
        </div>
      </nav>

      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <Button variant="ghost" className="w-full justify-start h-10 px-4 text-slate-500 dark:text-slate-400 opacity-80" href="#" leftIcon="help">
          도움말
        </Button>
        <form action={logoutAction}>
          <Button variant="ghost" className="w-full justify-start h-10 px-4 text-slate-500 dark:text-slate-400 opacity-80 hover:bg-red-50 hover:text-red-600" leftIcon="logout">
            로그아웃
          </Button>
        </form>
      </div>
    </aside>
  );
}
