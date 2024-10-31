import Link from "next/link";
import { gnbArray } from "@/lib/data";
import { gnbArrayList } from "@/types";
import { VscChevronRight } from "react-icons/vsc";

const MobileNavigator = () => {
  return (
    <nav>
      <ul className="flex flex-col justify-center">
        {gnbArray.map((el: gnbArrayList) => (
          <li
            key={el.label}
            className="flex items-center justify-between border-b-[1px] border-dark-gray cursor-pointer hover:bg-zinc-500 hover:text-white"
          >
            <Link href={el.path} className="block w-full h-full py-4 px-4">
              {el.label}
            </Link>
            <VscChevronRight size={20} className="mr-5" />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigator;
