import React from 'react';
import Link from 'next/link';

export function AuthBranding() {
  return (
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
  );
}
