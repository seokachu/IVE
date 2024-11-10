import { useId } from "react";

const SelectionControl = () => {
  const id = useId();

  return (
    <div className="flex text-sm items-center justify-between mt-5 pb-5 border-b border-dark-gray">
      <label htmlFor={`selectAll-${id}`}>
        <input
          type="checkbox"
          id={`selectAll-${id}`}
          className="mr-[6px] w-4 h-4 translate-y-[3px]"
        />
        전체선택 1/3
      </label>
      <button className="px-2 py-1 border rounded-md">전체삭제</button>
    </div>
  );
};

export default SelectionControl;
