import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";

import { ChangeEvent, useEffect, useState, useRef } from "react";

interface SearchProps {
  className?: string;
  placeholder: string;
  iconClassName?: string;
  onSearch: (value: string) => void;
}

const Search = ({ className, placeholder, iconClassName, onSearch }: SearchProps) => {
  const [value, setValue] = useState("");

  const debouncedSearch = useRef(
    debounce((searchValue: string) => {
      const trimmedValue = searchValue.trim();
      onSearch(trimmedValue);
    }, 500),
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  //언마운트 시 디바운스 취소
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="relative flex items-center">
      <Input type="text" placeholder={placeholder} className={className} onChange={handleChange} value={value} />
      <IoSearch className={iconClassName} />
    </div>
  );
};

export default Search;
