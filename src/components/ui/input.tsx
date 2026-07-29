import * as React from "react";
import { cn } from "@/utils/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        type === "checkbox"
          ? "w-4 h-4"
          : "flex h-12 w-full rounded-lg border border-gray-300 bg-background px-4 text-base lg:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus:outline-ring disabled:opacity-50",
        error && "border-destructive focus:border-destructive focus:outline-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
