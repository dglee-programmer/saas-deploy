import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-slate-200/20 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-manrope font-bold text-slate-900 text-xl">anynote</span>
          <p className="font-inter text-xs text-slate-500">© 2024 anynote. All rights reserved.</p>
        </div>
        <div className="flex gap-8 font-inter text-xs">
          <a className="text-slate-400 hover:text-blue-500 transition-colors" href="#">개인정보 처리방침</a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors" href="#">이용약관</a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors" href="#">문의하기</a>
        </div>
        <div className="flex gap-4">
          <a className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
            <span className="material-symbols-outlined text-sm">language</span>
          </a>
          <a className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
            <span className="material-symbols-outlined text-sm">alternate_email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
