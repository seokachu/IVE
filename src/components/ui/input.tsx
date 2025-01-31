import * as React from "react";
import { cn } from "@/utils/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-input bg-background px-5 py-6 text-base lg:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-slate-500 disabled:opacity-50",
          error &&
            "border-rose-500 focus:border-rose-400 focus:outline-rose-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
