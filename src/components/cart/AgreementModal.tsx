import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AGREEMENT_CONTENTS } from "@/utils/constants";
import type { AgreementModalProps } from "@/types";

const AgreementModal = ({ type, isOpen, onClose }: AgreementModalProps) => {
  const getModalContent = () => {
    switch (type) {
      case "privacy":
        return AGREEMENT_CONTENTS.PRIVACY;
      case "refund":
        return AGREEMENT_CONTENTS.REFUND;
      default:
        return {
          title: "",
          description: [],
        };
    }
  };
  const content = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl font-bold my-4">
            {content.title}
          </DialogTitle>
          <div className="space-y-4 w-full px-5 py-4">
            {content.description.map((item, index) => (
              <DialogDescription key={index} className="space-y-2 text-left">
                <span className="font-semibold pt-2 block">{item.heading}</span>
                {item.text.map((el, index) => (
                  <em key={index} className="pl-4 block not-italic">
                    {el}
                  </em>
                ))}
              </DialogDescription>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementModal;
