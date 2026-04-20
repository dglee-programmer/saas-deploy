import React from 'react';
import type { Metadata } from 'next';
import { AuthBranding } from './_components/AuthBranding';
import { AuthFormContainer } from './_components/AuthFormContainer';

export const metadata: Metadata = {
  title: "시작하기",
  description: "AES-256 암호화로 보호되는 당신만의 전문적인 워크스페이스에 접속하세요.",
};

export default function AuthPage() {
  return (
    <main className="flex min-h-screen bg-background font-body text-on-surface antialiased overflow-hidden">
      {/* Left Side: Visual Anchor (Server Component) */}
      <AuthBranding />

      {/* Right Side: Content Canvas (Client Component) */}
      <AuthFormContainer />

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
