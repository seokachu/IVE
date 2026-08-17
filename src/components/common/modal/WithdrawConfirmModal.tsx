import ConfirmModal from "@/components/common/modal/ConfirmModal";
import useWithdraw from "@/hooks/useWithdraw";

interface WithdrawConfirmModalProps {
  isOpen: (value: boolean) => void;
  onSuccess?: () => void;
}

//회원탈퇴 확인 모달 — 계정은 삭제하되 작성한 글·댓글은 "탈퇴한 회원"으로 남는다
const WithdrawConfirmModal = ({ isOpen, onSuccess }: WithdrawConfirmModalProps) => {
  const { handleWithdraw } = useWithdraw(onSuccess);

  return (
    <ConfirmModal
      isOpen={isOpen}
      onConfirm={handleWithdraw}
      title="정말 탈퇴하시겠어요?"
      description="계정과 개인정보는 즉시 삭제되며 되돌릴 수 없어요. 작성한 글과 댓글은 '탈퇴한 회원'으로 남고, 구독 중인 멤버십도 함께 해지돼요."
      cancelText="취소"
      confirmText="탈퇴하기"
      variant="destructive"
    />
  );
};

export default WithdrawConfirmModal;
