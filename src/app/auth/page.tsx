'use client'

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { signInAction, signUpAction } from '@/app/actions/auth.actions';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [signInResponse, signInFormAction, isSignInPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await signInAction(formData);
    },
    null
  );

  const [signUpResponse, signUpFormAction, isSignUpPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await signUpAction(formData);
    },
    null
  );

  const response = isLogin ? signInResponse : signUpResponse;
  const isPending = isLogin ? isSignInPending : isSignUpPending;
  const currentAction = isLogin ? signInFormAction : signUpFormAction;

  return (
    <main className="flex min-h-screen bg-background font-body text-on-surface antialiased overflow-hidden">
      {/* Left Side: Visual Anchor */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            alt="추상적인 파란색 파동" 
            className="w-full h-full object-cover opacity-80" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCFw4MEiT9fYSQZPNeqjXCJPXC_Ym69HYcT8ucl-yDEvWzUl490IjQ-9LpxHvsb_SXDVhQeVbItUGAwo4RcYjaf2kdwvGAHU5cepMhsj9A7VbOX-Mx0qGG4b8-maBGUpQ1RAoIJSPREY9LvQP-KszFKBQa3-1d-X37HOxCDGmXA5vyEwsL8djqvroLOPJ8pN4OuGXjmb5WXoxzd1rzNiVwy4zceBOkpedOyvMGhj4Ix4xNBFzSNyx9hPefHwbc9Av4dmDAik8hc3w"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-transparent to-primary-container/40"></div>
        </div>
        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              </div>
              <span className="font-headline font-extrabold text-2xl tracking-tight">anynote</span>
            </Link>
          </div>
          <div className="max-w-md">
            <h1 className="font-headline text-5xl font-extrabold leading-tight mb-6">
              당신의 생각을 정밀하게 기록하세요.
            </h1>
            <p className="text-on-primary-container text-lg font-light leading-relaxed opacity-90">
              지식 전문가들을 위한 프리미엄 클라우드 메모 서비스입니다. 흩어진 정보를 구조화된 지혜로 전환하세요.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium opacity-60">
            <span>© 2024 anynote 시스템</span>
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span>개인정보 우선 설계</span>
          </div>
        </div>
      </section>

      {/* Right Side: Content Canvas */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-surface">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <span className="font-headline font-extrabold text-xl tracking-tight">anynote</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              {isLogin ? '다시 오신 것을 환영합니다' : '새로운 시작을 환영합니다'}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {isLogin ? '당신만의 전문적인 워크스페이스에 접속하세요.' : '당신의 생각을 정밀하게 기록하기 시작하세요.'}
            </p>
          </div>

          {/* Form Toggle Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              로그인
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              계정 생성
            </button>
          </div>

          {/* Error Message Display */}
          {(response as any)?.success === false && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {(response as any).message}
            </div>
          )}

          {/* Success Message for Sign Up */}
          {(response as any)?.success === true && (
            <div className="p-4 bg-tertiary-container/10 border border-tertiary/20 text-tertiary rounded-xl text-sm font-medium flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>{(response as any).message || '가입 요청이 성공했습니다!'}</span>
              </div>
              <p className="text-xs text-on-surface-variant font-normal pl-7">
                입력하신 이메일로 <strong>인증 메일</strong>을 보냈습니다. 메일함(또는 스팸함)을 확인하여 링크를 클릭한 후 로그인해 주세요.
              </p>
              <button 
                onClick={() => setIsLogin(true)}
                className="mt-2 text-xs font-bold text-primary hover:underline self-end"
              >
                로그인 화면으로 이동 →
              </button>
            </div>
          )}

          {/* Social Authentication */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant hover:bg-surface-container-lowest transition-all group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-semibold text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant hover:bg-surface-container-lowest transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.96 0-2.04-.6-3.22-.6-1.2 0-2.34.62-3.21.62-1.38 0-3.37-1.74-4.21-4.14-1-2.92-.22-6.14 1.76-8 1.05-.98 2.22-1.52 3.33-1.52 1.25 0 2.23.75 3.03.75s1.86-.87 3.34-.87c1.33 0 2.45.54 3.23 1.54-2.83 1.5-2.38 5.4.52 6.64-.7 1.75-1.6 3.42-2.91 5.05-.58.74-1.16 1.48-1.67 1.48zM12.03 5.48c-.03-2.16 1.42-4.05 3.14-5.48.24 2.22-1.46 4.23-3.14 5.48z"></path>
              </svg>
              <span className="text-sm font-semibold text-on-surface">Apple</span>
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">또는 다음으로 계속하기</span>
            </div>
          </div>

          {/* Form Fields */}
          <form action={currentAction} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors">이메일 주소</label>
              <div className="relative">
                <input 
                  name="email"
                  required
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface placeholder-outline transition-all" 
                  placeholder="name@company.com" 
                  type="email"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-outline-variant">alternate_email</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-focus-within:text-primary transition-colors">비밀번호</label>
                <button type="button" className="text-xs font-semibold text-primary hover:underline">비밀번호 찾기</button>
              </div>
              <div className="relative">
                <input 
                  name="password"
                  required
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface placeholder-outline transition-all" 
                  placeholder="••••••••" 
                  type="password"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-outline-variant">visibility_off</span>
                </div>
              </div>
            </div>
            <button 
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
            >
              {isPending ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isLogin ? 'anynote 로그인' : '무료 계정 생성'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-primary hover:underline ml-1"
            >
              {isLogin ? '무료 체험 시작하기' : '로그인으로 돌아가기'}
            </button>
          </p>
        </div>
      </section>

      {/* Floating Security Chip */}
      <div className="fixed bottom-8 right-8 hidden md:block">
        <div className="bg-white/70 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-white/40 shadow-xl">
          <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <span className="text-xs font-bold text-on-surface tracking-tight">AES-256 암호화 보호</span>
        </div>
      </div>
    </main>
  );
}
