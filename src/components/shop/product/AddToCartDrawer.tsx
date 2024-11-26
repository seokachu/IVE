import ActionButton from "@/components/common/button/ActionButton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToCartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { push } = useRouter();

  const onClickCart = () => {
    push("/cart");
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>장바구니에 상품이 담겼습니다.</DrawerTitle>
          <DrawerDescription className="sr-only">
            장바구니 영역
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-row pb-10">
          <ActionButton
            variant="outline"
            onClick={onClickCart}
            className="w-full lg:w-2/4 py-3 text-center"
          >
            장바구니 보기
          </ActionButton>
          <div className="w-full lg:w-2/4">
            <DrawerClose asChild>
              <ActionButton
                variant="primary"
                className="w-full py-3 text-center"
              >
                계속 쇼핑하기
              </ActionButton>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddToCartDrawer;
