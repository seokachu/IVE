"use client";

import AddressAddButton from "@/components/mypage/AddressAddButton";
import AddressListItems from "@/components/mypage/AddressListItems";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import { motion, AnimatePresence } from "framer-motion";

const AddressManagementPage = () => {
  const session = useRecoilValue(sessionState);
  const { data: addresses, isLoading } = useShippingAddresses(
    session?.user?.id
  );

  //로딩 추가해야함
  if (isLoading) return null;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">배송지 관리</h2>
        {addresses ? <AddressAddButton /> : null}
      </div>
      {addresses ? (
        <AnimatePresence initial={false}>
          <motion.ul layout className="mt-5">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  layout: { duration: 0.3 },
                }}
                className="mb-5"
              >
                <AddressListItems item={address} />
              </motion.div>
            ))}
          </motion.ul>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>배송지가 없습니다.</h3>
          <AddressAddButton />
        </div>
      )}
    </div>
  );
};

export default AddressManagementPage;
