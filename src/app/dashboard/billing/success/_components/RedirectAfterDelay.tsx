'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectAfterDelayProps {
  delay: number;
  to: string;
}

export function RedirectAfterDelay({ delay, to }: RedirectAfterDelayProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, to, router]);

  return null;
}
