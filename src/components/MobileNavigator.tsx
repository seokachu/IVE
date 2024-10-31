import Link from "next/link";
import { gnbArray } from "@/lib/data";
import { gnbArrayList } from "@/types";
import { VscChevronRight } from "react-icons/vsc";

const MobileNavigator = () => {
  return (
    <nav className="!mt-10">
      <ul className="flex flex-col justify-center">
        {gnbArray.map((el: gnbArrayList) => (
          <li
            key={el.label}
            className="flex items-center justify-between py-4 px-4 border-b-[1px] border-dark-gray cursor-pointer hover:bg-slate-300"
          >
            <Link href={el.path} className="block w-full">
              {el.label}
            </Link>
            <VscChevronRight size={20} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigator;
