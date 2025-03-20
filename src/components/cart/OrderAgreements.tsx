import { useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import AgreementModal from './AgreementModal';
import { useRecoilState } from 'recoil';
import { agreementsState } from '@/store';
import AgreementCheckbox from './AgreementCheckbox';
import type { AgreementType, ModalType } from '@/types/cart';

const OrderAgreements = () => {
  const [agreements, setAgreements] = useRecoilState(agreementsState);
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

    if (type === 'main') {
      handleMainCheckbox(isChecked);
    } else {
      handleSubCheckBox(type, isChecked);
    }
  };

  //모달창 열기
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
    <div>
      <h2 className="font-bold border-b pb-4 mb-5">주문동의</h2>
      <div className="text-sm space-y-2">
        <div>
          <div className="flex items-center justify-between cursor-pointer" onClick={handleToggle}>
            <label className="flex items-center" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="mr-2"
                checked={agreements.main}
                onChange={handleAgreementChange('main')}
              />
              &#91;필수&#93; 주문 내역에 대한 필수 동의
            </label>
            <button type="button" className="text-gray-500" aria-label={isOpen ? '접기' : '펼치기'}>
              <IoIosArrowUp
                className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-0' : 'rotate-180'}`}
              />
            </button>
          </div>
          {isOpen && (
            <div className="pl-6 mt-3 space-y-2">
              <AgreementCheckbox
                modalType={() => handleOpenModal('privacy')}
                onChange={handleAgreementChange('privacy')}
                checked={agreements.privacy}
                labelText="&#91;필수&#93; 개인정보 수집 및 이용 및 제 3자 제공 동의"
              />
              <AgreementCheckbox
                modalType={() => handleOpenModal('refund')}
                onChange={handleAgreementChange('refund')}
                checked={agreements.refund}
                labelText="&#91;필수&#93; 결제 이후 환불 및 취소 불가 동의"
              />
            </div>
          )}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm text-center my-3">본인은 만 14세 이상이며 주문내용을 확인하였습니다.</h3>
      <AgreementModal type={selectedAgreement} isOpen={selectedAgreement !== null} onClose={handleCloseModal} />
    </div>
  );
};

export default OrderAgreements;
