import { gnbArray } from "@/lib/data";
import { VscChevronRight } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import type { gnbArrayList } from "@/types";

const MobileNavigator = () => {
  const { push } = useRouter();

  return (
    <nav>
      <ul className="flex flex-col justify-center">
        {gnbArray.map((el: gnbArrayList) => (
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
