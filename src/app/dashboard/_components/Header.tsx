'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth.actions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    // Change URL without jumping or reloading if possible, 
    // but in App Router we can just push/replace.
    router.replace(`/dashboard?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-30 px-8 py-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-surface-container-lowest/80 backdrop-blur-xl px-6 py-3 rounded-xl shadow-[0_32px_64px_-12px_rgba(25,27,35,0.06)] border border-outline-variant/5">
        <div className="flex items-center gap-2 text-on-surface-variant font-medium">
          <span className="text-on-surface-variant/50">워크스페이스</span>
          <Icon name="chevron_right" size={16} className="text-on-surface-variant/50" />
          <span className="text-primary font-bold">대시보드</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center bg-surface-container-low rounded-full px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-fixed focus-within:bg-white group">
            <Icon name="search" className="text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 lg:w-64 px-2 placeholder:text-on-surface-variant/60"
              placeholder="메모 검색..."
              type="text"
              value={currentQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-secondary-container p-0.5 ring-2 ring-transparent group-hover:ring-primary/20 transition-all overflow-hidden">
                <img
                  alt="사용자 프로필"
                  className="w-full h-full rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9ilEZTr4VsaA2loLJKe5EAULuIfUzWLvfzUQZf4Dg3DWup-79nz4KfgloBD4wtDUsEi3ExyArFsAuntdklGSqSNNiM6UgGak6Yf6AjladV4ain15_yFOtvoO2lPGLxUsUZ9MkAJkT_GbHat-rO8at77DBQ_Vxhke81s-aBpttnkkrijEeT_byE_PutuEN2Eh5tIj_PMI_O-oJZ3jvwvheXyPqZPqWNawc-MxprenVGGvsDXSYbYTbPAsMnAwgDpnXlV0URXeRDG8"
                />
              </div>

              {/* Profile Dropdown Mockup UI */}
              {/* <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-outline-variant/10 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-50">
                <div className="px-3 py-2 border-b border-outline-variant/5 mb-2">
                  <p className="text-xs font-bold text-on-surface">Adrian 계정</p>
                  <p className="text-[10px] text-on-surface-variant">adrian@example.com</p>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-9" leftIcon="person">
                  프로필 설정
                </Button>
                <form action={logoutAction}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-9 text-error hover:text-error" leftIcon="logout">
                    로그아웃
                  </Button>
                </form>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
