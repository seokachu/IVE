import { VscChevronRight } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import type { GnbArrayList } from "@/types";
import { GNB_ARRAY } from "@/utils/constants";

const MobileNavigator = () => {
  const { push } = useRouter();

  return (
    <nav>
      <ul className="flex flex-col justify-center">
        {GNB_ARRAY.map((el: GnbArrayList) => (
          <li
            key={el.label}
            className="data-[state=closed] border-b-[1px] border-dark-gray cursor-pointer hover:bg-zinc-400 hover:text-white"
          >
            <SheetClose asChild>
              <button
                onClick={() => push(el.path)}
                className="w-full h-full py-4 px-4 text-left flex items-center justify-between"
              >
                <span>{el.label}</span>
                <VscChevronRight size={20} />
              </button>
            </SheetClose>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigator;
