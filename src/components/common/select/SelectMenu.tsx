import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectMenuProps<T> {
  options: T[];
  defaultValue?: string;
}

const SelectMenu = <T extends { value: string; title: string }>({
  options,
  ...props
}: SelectMenuProps<T>) => {
  return (
    <Select>
      <SelectTrigger className="lg:w-[180px] w-full">
        <SelectValue placeholder={options[0]?.title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((el) => (
            <SelectItem key={el.value} value={el.value}>
              {el.title}
            </SelectItem>
          ))}
          {/* <SelectItem value="best">인기순</SelectItem>
          <SelectItem value="latest">최신순</SelectItem> */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMenu;
