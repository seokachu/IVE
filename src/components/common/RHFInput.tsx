"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface RHFInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  messageClassName?: string;
}

export function RHFInput({
  name,
  messageClassName,
  type = "text",
  ...props
}: RHFInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {type === "checkbox" ? (
              <Input
                {...props}
                {...field}
                type="checkbox"
                checked={field.value ?? false}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                }}
              />
            ) : (
              <Input
                {...props}
                {...field}
                type={type}
                value={field.value || ""}
                error={!!errors[name]}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              />
            )}
          </FormControl>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
    />
  );
}
