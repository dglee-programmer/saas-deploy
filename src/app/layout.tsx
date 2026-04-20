import type { Metadata } from "next";
import "./globals.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "anynote | 아키텍처 큐레이터",
  description: "당신의 디지털 정신을 위한 아키텍처 큐레이터. 고성능 워크스페이스를 통해 메모를 손쉽게 정리하고 검색하며 동기화하세요.",
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
