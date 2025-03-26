import { IoIosArrowForward } from "react-icons/io";
import type { AgreementCheckboxProps } from "@/types/cart";

const AgreementCheckbox = ({ modalType, onChange, checked, labelText }: AgreementCheckboxProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-baseline">
        <input type="checkbox" className="mr-2 translate-y-[1px]" checked={checked} onChange={onChange} />
        {labelText}
      </label>
      <button onClick={modalType}>
        <IoIosArrowForward className="text-gray-500" />
      </button>
    </div>
  );
};

export default AgreementCheckbox;
