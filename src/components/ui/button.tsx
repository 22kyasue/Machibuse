import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-500",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
  outline:
    "border border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm min-h-[36px]",
  md: "px-4 py-2.5 text-sm min-h-[40px]",
  lg: "px-6 py-3 text-base min-h-[44px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
