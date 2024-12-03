import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import SelectMenu from "./SelectMenu";

interface RHFSelectProps<T> {
  name: string;
  options: T[];
  className?: string;
  messageClassName?: string;
  onChange?: (value: string) => void;
}

export function RHFSelect<T extends { value: string; title: string }>({
  name,
  options,
  className,
  messageClassName,
  onChange,
}: RHFSelectProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <SelectMenu
              options={options}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
              className={className}
            />
          </FormControl>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
    />
  );
}
