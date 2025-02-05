import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";

interface SearchProps {
  className?: string;
  placeholder: string;
  iconClassName?: string;
}

const Search = ({ className, placeholder, iconClassName }: SearchProps) => {
  return (
    <>
      <Input type="text" placeholder={placeholder} className={className} />
      <IoSearch className={iconClassName} />
    </>
  );
};

export default Search;
