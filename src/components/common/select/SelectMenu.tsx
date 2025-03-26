import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectMenuProps<T> {
  options: T[];
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

const SelectMenu = <T extends { value: string; title: string; disabled?: boolean }>({
  options,
  value,
  onChange,
  className,
}: SelectMenuProps<T>) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={className}
        aria-label={value ? `${value} 선택하기` : `${options[0]?.title || "옵션"} 선택하기`}
      >
        <SelectValue placeholder={options[0]?.title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((el) => (
            <SelectItem key={el.value} value={el.value} disabled={el.disabled}>
              {el.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMenu;
