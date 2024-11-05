import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectMenu = () => {
  return (
    <Select>
      <SelectTrigger className="lg:w-[180px] w-full">
        <SelectValue placeholder="인기순" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="best">인기순</SelectItem>
          <SelectItem value="latest">최신순</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectMenu;
