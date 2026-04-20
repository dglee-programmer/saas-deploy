import type { Metadata } from "next";
import "./globals.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "anynote | 지식 전문가를 위한 아키텍처 큐레이터",
  description: "당신의 디지털 정신을 위한 아키텍처 큐레이터. 고성능 워크스페이스를 통해 메모를 손쉽게 정리하고 검색하며 동기화하세요.",
  openGraph: {
    title: "anynote | 지식 전문가를 위한 아키텍처 큐레이터",
    description: "흩어진 정보를 구조화된 지혜로 전환하세요. 프리미엄 클라우드 메모 서비스.",
    siteName: "anynote",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "anynote | 아키텍처 큐레이터 공식 소개 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "anynote",
    description: "당신의 디지털 정신을 위한 아키텍처 큐레이터",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
