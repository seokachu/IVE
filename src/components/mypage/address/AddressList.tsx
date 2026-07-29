import AddressListItem from "./AddressListItem";
import type { AddressListProps } from "@/types/mypage";

const AddressList = ({ addresses }: AddressListProps) => {
  return (
    <ul className="mt-5">
      {addresses.map((address) => (
        <li key={address.id} className="mb-5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <AddressListItem item={address} />
        </li>
      ))}
    </ul>
  );
};

export default AddressList;
