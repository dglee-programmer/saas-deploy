import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-sm hover:opacity-90 hover:scale-[0.98]",
        secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed",
        ghost: "text-slate-600 hover:text-primary hover:bg-surface-container-low",
        outline: "border border-outline-variant hover:bg-surface-container-lowest",
        error: "bg-error-container text-on-error-container hover:bg-error hover:text-white",
        text: "text-primary hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-6 py-2.5 text-sm",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  leftIcon?: string;
  rightIcon?: string;
  leftIconFilled?: boolean;
  rightIconFilled?: boolean;
  isLoading?: boolean;
}

/**
 * Universal Button component that handles both regular buttons and Next.js Links.
 */
export function Button({
  className,
  variant,
  size,
  href,
  leftIcon,
  rightIcon,
  leftIconFilled,
  rightIconFilled,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const content = (
    <>
      {isLoading && (
        <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isLoading && leftIcon && (
        <Icon name={leftIcon} filled={leftIconFilled} className={cn("text-[1.25em]", children && "mr-2")} />
      )}
      {children}
      {!isLoading && rightIcon && (
        <Icon name={rightIcon} filled={rightIconFilled} className={cn("text-[1.25em]", children && "ml-2")} />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {content}
    </button>
  );
}
