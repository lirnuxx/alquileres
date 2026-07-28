import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  default:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  outline:
    "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "text-slate-700 hover:bg-slate-100",
  link: "text-brand-600 underline-offset-4 hover:underline",
} as const;

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-lg px-3 text-sm",
  lg: "h-11 rounded-xl px-8 text-base",
  icon: "h-10 w-10",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
