import React from 'react';
import Link from 'next/link';
import { getUserSession } from '@/app/actions/auth.actions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export async function TopNavBar() {
  const user = await getUserSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="account_balance_wallet" filled className="text-white text-2xl" />
            </div>
            <span className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">anynote</span>
          </Link>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" size="sm" href="/#features" className="text-primary border-b-2 border-primary rounded-none h-auto py-1">
              주요 기능
            </Button>
            <Button variant="ghost" size="sm" href="/#pricing">
              요금제
            </Button>
            <Button variant="ghost" size="sm" href="/#features">
              소개
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" href="/auth" className="hidden lg:flex">
                로그인
              </Button>
              <Button variant="primary" href="/auth">
                시작하기
              </Button>
            </>
          ) : (
            <Button variant="primary" href="/dashboard" leftIcon="dashboard">
              대시보드
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
