import { LogOut } from "lucide-react";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import useSignOut from "@/hooks/useSignOut";

interface LogoutConfirmModalProps {
  isOpen: (value: boolean) => void;
  onSuccess?: () => void;
}

//로그아웃 진입점(헤더 드롭다운 · 드로어 · 마이페이지) 공용 확인 모달 — .pen "로그아웃 확인 모달" 시안
const LogoutConfirmModal = ({ isOpen, onSuccess }: LogoutConfirmModalProps) => {
  const { handleSignOut } = useSignOut(onSuccess);

  return (
    <ConfirmModal
      isOpen={isOpen}
      onConfirm={handleSignOut}
      title="로그아웃 하시겠습니까?"
      description="언제든 다시 로그인할 수 있어요."
      cancelText="취소"
      confirmText="로그아웃"
      icon={<LogOut size={22} className="text-purple-400" />}
    />
  );
};

export default LogoutConfirmModal;
