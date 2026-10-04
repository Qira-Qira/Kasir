import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const variants = {
    default: "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)] hover:bg-[#6d3f2a]",
    outline: "border border-[#e7d7c4] bg-[#fffaf5] text-[#382a22] hover:bg-[#f5e7da]",
    ghost: "text-[#4d382d] hover:bg-[#f4e6d8]",
    secondary: "bg-[#f3e6d9] text-[#382a22] hover:bg-[#ecd8bf]",
  };
  const sizes = {
    default: "h-10 px-4 py-2 rounded-xl",
    sm: "h-9 px-3 rounded-xl",
    lg: "h-12 px-8 rounded-2xl",
    icon: "h-9 w-9 rounded-xl",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
