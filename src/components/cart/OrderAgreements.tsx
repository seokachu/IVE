import { Button } from "@/components/ui/button";
import { useState } from "react";
import AgreementModal from "./AgreementModal";
import AgreementCheckbox from "./AgreementCheckbox";
import { useAgreements, useCheckoutActions } from "@/store/zustand";
import type { AgreementType, ModalType } from "@/types/cart";

const OrderAgreements = () => {
  const agreements = useAgreements();
  const { setAgreements } = useCheckoutActions();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<ModalType>(null);

  //필수 동의 - 부모 checkbox
  const handleMainCheckbox = (isChecked: boolean) => {
    setAgreements({
      main: isChecked,
      privacy: isChecked,
      refund: isChecked,
    });
  };

  //필수 동의 - 자식 checkbox
  const handleSubCheckBox = (type: AgreementType, isChecked: boolean) => {
    const updatedAgreements = {
      ...agreements,
      [type]: isChecked,
    };

    updatedAgreements.main = updatedAgreements.privacy && updatedAgreements.refund;

    setAgreements(updatedAgreements);
  };

  //통합 핸들러
  const handleAgreementChange = (type: AgreementType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (type === "main") {
      handleMainCheckbox(isChecked);
    } else {
      handleSubCheckBox(type, isChecked);
    }
  };

  //약관 목록 펼치기/접기
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 모달 열기 핸들러
  const handleOpenModal = (type: Exclude<ModalType, null>) => {
    setSelectedAgreement(type);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedAgreement(null);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-gray-500">
          <input type="checkbox" checked={agreements.main} onChange={handleAgreementChange("main")} />
          &#91;필수&#93; 주문 내역 확인 및 결제 동의
        </label>
        <Button
          variant="plain"
          size="auto"
          onClick={handleToggle}
          className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-500"
        >
          {isOpen ? "접기" : "약관 보기"}
        </Button>
      </div>
      {isOpen && (
        <div className="mt-2.5 flex flex-col gap-2 rounded-xl bg-gray-50 p-3.5">
          <AgreementCheckbox
            modalType={() => handleOpenModal("privacy")}
            onChange={handleAgreementChange("privacy")}
            checked={agreements.privacy}
            labelText="&#91;필수&#93; 개인정보 수집 및 이용 및 제 3자 제공 동의"
          />
          <AgreementCheckbox
            modalType={() => handleOpenModal("refund")}
            onChange={handleAgreementChange("refund")}
            checked={agreements.refund}
            labelText="&#91;필수&#93; 결제 이후 환불 및 취소 불가 동의"
          />
        </div>
      )}
      <AgreementModal type={selectedAgreement} isOpen={selectedAgreement !== null} onClose={handleCloseModal} />
    </div>
  );
};

export default OrderAgreements;
