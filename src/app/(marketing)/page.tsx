import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default async function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-8 py-20 max-w-7xl mx-auto lg:py-32 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-left space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-sm font-semibold tracking-wide uppercase">
              프리미엄 클라우드 메모 서비스
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-tight tracking-tighter font-headline">
              아이디어를 <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">생각의 속도로</span> 포착하세요.
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
              당신의 디지털 정신을 위한 아키텍처 큐레이터. 고성능 워크스페이스를 통해 메모를 손쉽게 정리하고 검색하며 동기화하세요.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary" size="xl" href="/auth" className="shadow-lg shadow-primary/20">
                무료 체험 시작
              </Button>
              <Button variant="secondary" size="xl" leftIcon="play_circle">
                데모 보기
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-tertiary-fixed/20 rounded-full blur-3xl"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-outline-variant/20">
              <img
                alt="디지털 워크스페이스"
                className="w-full h-auto object-cover aspect-video"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy72l8F1IfFD6B9hvd3Lgr3gx2hYRuQGbq8Rj_rNrIk3STB0VeJkQRIdRwaVrCATJJn22dHAmFRY6vMORVB8GhcEpclX_EPNnNThSvYiw9UaFYuzHwd0kTed3H9uJq3QTSF6cV5cAFVI2R9M6CsQNYCHBarMzPaBSZVvafCFzvGMB0C2cfwIUOKvpithk2INKr-ZHoLPE-M6r0_s9EJ6LoAA1deEN6-ugL7DTxVEJFLboWecihxXq30Q04hylwugwmaYPJkJyERDc"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4 font-headline">생각을 위한 정밀 공학</h2>
            <p className="text-on-surface-variant font-body">현대의 큐레이터를 위해 제작된 anynote는 미학적 감각과 강력한 구조적 성능을 결합합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Multi-device Sync */}
            <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-4">devices</span>
                <h3 className="text-2xl font-bold mb-3 font-headline">멀티 디바이스 동기화</h3>
                <p className="text-on-surface-variant mb-6 font-body">당신의 생각이 당신을 따라갑니다. 데스크톱, 웹, 모바일 간의 즉각적인 동기화로 아이디어를 언제 어디서나 확인하세요.</p>
              </div>
              <img
                alt="멀티 디바이스 동기화"
                className="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaC8E3n0PpKWJedFGiA27pZQmYmUVTnVRVOev68jNmo131ZqoeSjaKySqXcIhKBoH9Ey2qh2RXO5ehyTE4_KAvi75P3z8rcpLzf9WfMHKq5aGaot-Z3XI_mGAticPWAYh1ZnMDxtbp5iBBU4Fqut25tp899gebZQH-Nld5-Tgy0_gdDYU9rbviQvqnuZ5KbBlSef_tElwc2F07LYr_-O2vVb9aU3foOeCkbaiBiBAtUMtMPGjQ5wMkZdm0tW4E0Prs80OSHLaLD4U"
              />
            </div>
            {/* Smart Search */}
            <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between shadow-lg">
              <div>
                <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">search_spark</span>
                <h3 className="text-2xl font-bold mb-3 text-white font-headline">스마트 검색</h3>
                <p className="text-blue-100 mb-4 text-sm font-body">단순 키워드가 아닌 문맥을 이해하는 딥 시맨틱 검색. 몇 달 전의 메모도 순식간에 찾아냅니다.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-md">
                <div className="w-full h-2 bg-white/20 rounded-full mb-2"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
              </div>
            </div>
            {/* Collaborative Folders */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary text-5xl mb-4">folder_shared</span>
              <h3 className="text-xl font-bold mb-2 font-headline">협업 폴더</h3>
              <p className="text-on-surface-variant text-sm font-body">컬렉션을 함께 큐레이션하세요. 명확한 구조를 중시하는 팀을 위한 공유 워크스페이스입니다.</p>
            </div>
            {/* Rich Text Editing */}
            <div className="md:col-span-2 lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 font-headline">리치 텍스트 편집</h3>
                <p className="text-on-surface-variant max-w-md font-body">집중력을 흐트러뜨리지 않는 편집 경험. 마크다운 지원, 아름다운 타이포그래피, 간편한 서식 지정을 제공합니다.</p>
              </div>
              <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-100 group-hover:-translate-y-2 transition-transform">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded-full w-4/6"></div>
                </div>
              </div>
            </div>
            {/* Extra Aesthetic Feature */}
            <div className="lg:col-span-2 bg-gradient-to-br from-surface-container-high to-surface-container-low p-8 rounded-xl border border-outline-variant/10 flex items-center justify-between">
              <div className="max-w-xs">
                <h3 className="text-xl font-bold mb-2 font-headline">설계부터 안전한 보안</h3>
                <p className="text-on-surface-variant text-sm font-body">당신의 지식은 오직 당신만의 것입니다. 종단간 암호화로 원장을 비공개로 안전하게 보호합니다.</p>
              </div>
              <span className="material-symbols-outlined text-5xl text-on-surface/20" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold mb-4 font-headline">멤버십 요금제</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto font-body">당신의 워크플로우에 맞는 큐레이션 수준을 선택하세요. 개인 일기부터 기업의 지식 베이스까지 지원합니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch font-body">
          {/* Free Tier */}
          <div className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col">
            <h3 className="text-xl font-bold mb-2 font-headline">무료</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩0</span>
              <span className="text-on-surface-variant">/월</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 100개 개인 메모
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 2개 기기 동기화
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 표준 검색 기능
              </li>
            </ul>
            <Link href="/auth" className="w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary-fixed transition-colors text-center">
              무료로 시작하기
            </Link>
          </div>
          {/* Pro Tier (Highlighted) */}
          <div className="p-10 rounded-xl bg-surface-container-highest border-2 border-primary relative flex flex-col shadow-2xl scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">추천</div>
            <h3 className="text-xl font-bold mb-2 font-headline">프로</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩15,000</span>
              <span className="text-on-surface-variant">/월</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 무제한 메모
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 무제한 기기 동기화
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 스마트 시맨틱 검색
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 우선 고객 지원
              </li>
            </ul>
            <Link href="/auth" className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg hover:opacity-90 transition-opacity text-center">
              프로로 업그레이드
            </Link>
          </div>
          {/* Enterprise Tier */}
          <div className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col">
            <h3 className="text-xl font-bold mb-2 font-headline">엔터프라이즈</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩60,000</span>
              <span className="text-on-surface-variant">/월</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 프로의 모든 기능
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 팀 거버넌스 및 관리
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> SSO 및 고급 보안
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 커스텀 API 액세스
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg font-bold bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors">
              영업팀 문의
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-8 mb-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-slate-50 p-12 lg:p-20 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight font-headline">당신만의 아키텍처 큐레이션을 시작할 준비가 되셨나요?</h2>
            <p className="text-slate-300 text-lg mb-10 font-body">자신의 지식을 소중히 다루는 50,000명 이상의 크리에이터와 함께하세요.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-extrabold text-lg shadow-xl hover:bg-slate-100 transition-colors">
                지금 원장 만들기
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
