import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToCartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { push } = useRouter();

  const onClickCart = () => {
    push("/cart");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>장바구니에 상품이 담겼습니다.</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            장바구니 영역
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClickCart}>
            장바구니 보기
          </AlertDialogAction>
          <AlertDialogCancel>계속 쇼핑하기</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddToCartModal;
