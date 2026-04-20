'use client';

import React, { useState } from 'react';

import { signInAction, signUpAction } from '@/app/actions/auth.actions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const action = isLogin ? signInAction : signUpAction;
    
    const result = await action(formData) as { success?: boolean; message?: string } | undefined;
    
    if (result && result.success === false) {
      setMessage(result.message || null);
    } else if (result && result.success === true) {
      setMessage(result.message || null);
      if (!isLogin) setIsLogin(true); // 가입 성공 시 로그인으로 탭 전환
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-10">
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
          {isLogin ? '다시 오신 것을 환영합니다' : '새로운 시작을 함께하세요'}
        </h2>
        <p className="text-on-surface-variant font-medium">
          {isLogin ? '당신만의 전문적인 워크스페이스에 접속하세요.' : 'anynote의 프리미엄 기능을 시작해 보세요.'}
        </p>
      </div>

      <div className="flex p-1 bg-surface-container-low rounded-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLogin(true)}
          className={cn(
            "flex-1 py-2.5 h-auto",
            isLogin ? "bg-white text-primary shadow-sm hover:bg-white" : "text-on-surface-variant"
          )}
        >
          로그인
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLogin(false)}
          className={cn(
            "flex-1 py-2.5 h-auto",
            !isLogin ? "bg-white text-primary shadow-sm hover:bg-white" : "text-on-surface-variant"
          )}
        >
          계정 생성
        </Button>
      </div>

      {/* Social Authentication (Placeholders) */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="gap-3 py-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm font-semibold text-on-surface">Google</span>
        </Button>
        <Button variant="outline" className="gap-3 py-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.96 0-2.04-.6-3.22-.6-1.2 0-2.34.62-3.21.62-1.38 0-3.37-1.74-4.21-4.14-1-2.92-.22-6.14 1.76-8 1.05-.98 2.22-1.52 3.33-1.52 1.25 0 2.23.75 3.03.75s1.86-.87 3.34-.87c1.33 0 2.45.54 3.23 1.54-2.83 1.5-2.38 5.4.52 6.64-.7 1.75-1.6 3.42-2.91 5.05-.58.74-1.16 1.48-1.67 1.48zM12.03 5.48c-.03-2.16 1.42-4.05 3.14-5.48.24 2.22-1.46 4.23-3.14 5.48z"></path>
          </svg>
          <span className="text-sm font-semibold text-on-surface">Apple</span>
        </Button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">또는</span>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            message.includes('가입') ? 'bg-tertiary-container/10 text-tertiary' : 'bg-error-container/20 text-error'
          }`}>
            {message}
          </div>
        )}
        
        <div className="space-y-2 group">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors font-headline" htmlFor="email">
            이메일 주소
          </label>
          <div className="relative">
            <input
              className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface placeholder-outline transition-all"
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              required
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Icon name="alternate_email" className="text-outline-variant" />
            </div>
          </div>
        </div>

        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors font-headline" htmlFor="password">
              비밀번호
            </label>
            {isLogin && (
              <a className="text-xs font-semibold text-primary hover:underline" href="#">비밀번호 찾기</a>
            )}
          </div>
          <div className="relative">
            <input
              className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface placeholder-outline transition-all"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Icon name="visibility_off" className="text-outline-variant" />
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full py-7"
          isLoading={isLoading}
          rightIcon="arrow_forward"
          type="submit"
        >
          {`anynote ${isLogin ? '로그인' : '계정 생성'}`}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant leading-relaxed">
        {isLogin ? (
          <>
            계정이 없으신가요? <button onClick={() => setIsLogin(false)} className="font-bold text-primary hover:underline">무료 체험 시작하기</button>
          </>
        ) : (
          <>
            이미 계정이 있으신가요? <button onClick={() => setIsLogin(true)} className="font-bold text-primary hover:underline">로그인 하기</button>
          </>
        )}
      </p>
    </div>
  );
}
