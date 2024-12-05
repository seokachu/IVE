import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddressForm from "./AddressForm";
import type { Tables } from "@/types/supabase";

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressData: Tables<"shipping_addresses">;
}

const AddressEditModal = ({
  isOpen,
  onClose,
  addressData,
}: AddressEditModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] h-[80vh] overflow-y-auto py-16">
        <DialogHeader>
          <DialogTitle className="mb-4">배송지 수정</DialogTitle>
          <DialogDescription className="sr-only">배송지 수정</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full">
          <AddressForm
            mode="edit"
            initialData={addressData}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressEditModal;
