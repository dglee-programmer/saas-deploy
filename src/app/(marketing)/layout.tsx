import React from 'react';
import { TopNavBar } from "@/components/common/TopNavBar";
import { Footer } from "@/components/common/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavBar />
      <div className="min-h-screen pt-20">
        {children}
      </div>
      <Footer />
    </>
  );
}
