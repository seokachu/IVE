import { IoIosArrowForward } from "react-icons/io";

interface AgreementCheckboxProps {
  modalType: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  labelText: string;
}

const AgreementCheckbox = ({
  modalType,
  onChange,
  checked,
  labelText,
}: AgreementCheckboxProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          className="mr-2"
          checked={checked}
          onChange={onChange}
        />
        {labelText}
      </label>
      <button onClick={modalType}>
        <IoIosArrowForward className="text-gray-500" />
      </button>
    </div>
  );
};

export default AgreementCheckbox;
