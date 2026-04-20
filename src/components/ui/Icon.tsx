import { cn } from "@/lib/utils";
import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  size?: number | string;
  color?: string;
}

/**
 * Common Icon component using Google Material Symbols.
 */
export function Icon({ name, filled = false, size, color, className, ...props }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        fontSize: size,
        color: color,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...props.style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
