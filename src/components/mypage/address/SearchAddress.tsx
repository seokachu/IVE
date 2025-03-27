import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
interface SearchAddressProps {
  onClose: () => void;
  onAddressChange: (data: { zonecode: string; fullAddress: string }) => void;
}

const SearchAddress = ({ onClose, onAddressChange }: SearchAddressProps) => {
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";
    const zonecode = data.zonecode;

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onAddressChange({ zonecode, fullAddress });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[500px] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-purple z-10">
          &times;
        </button>
        <h2 className="text-lg font-medium mb-4">주소 검색</h2>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default SearchAddress;
