"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  SelectHTMLAttributes,
  forwardRef,
  useId,
} from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm shadow-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
