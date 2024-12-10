import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectMenuProps<T> {
  options: T[];
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

const SelectMenu = <
  T extends { value: string; title: string; disabled?: boolean }
>({
  options,
  value,
  onChange,
  className,
}: SelectMenuProps<T>) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={options[0]?.title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((el, index) => (
            <SelectItem key={el.value} value={el.value} disabled={index === 0}>
              {el.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMenu;
