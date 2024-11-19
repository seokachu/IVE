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
            className="data-[state=closed] flex items-center justify-between border-b-[1px] border-dark-gray cursor-pointer hover:bg-zinc-500 hover:text-white"
          >
            <SheetClose asChild>
              <button
                onClick={() => push(el.path)}
                className="block w-full h-full py-4 px-4 text-left"
              >
                {el.label}
              </button>
            </SheetClose>
            <VscChevronRight size={20} className="mr-5" />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigator;
