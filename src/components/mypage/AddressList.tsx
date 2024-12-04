import { motion, AnimatePresence } from "framer-motion";
import AddressListItems from "./AddressListItems";
import type { AddressListProps } from "@/types";

const AddressList = ({ addresses }: AddressListProps) => {
  return (
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
  );
};

export default AddressList;
