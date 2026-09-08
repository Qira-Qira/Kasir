import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variantClass = variant === "secondary"
    ? "bg-secondary text-secondary-foreground"
    : "bg-primary text-primary-foreground";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass} ${className}`} {...props} />;
}
