import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
            className="data-[state=closed] border-b-[1px] border-gray-300 cursor-pointer hover:bg-gray-400 hover:text-white"
          >
            <SheetClose asChild>
              <Button variant="plain" size="auto"
                onClick={() => push(el.path)}
                className="w-full h-full py-4 px-4 font-normal text-base text-left flex items-center justify-between"
              >
                <span>{el.label}</span>
                <ChevronRight size={20} />
              </Button>
            </SheetClose>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavigator;
