import type { GnbArrayList } from "@/types";
import { GNB_ARRAY } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigator = () => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="hidden lg:flex lg:gap-10 lg:items-center">
        {GNB_ARRAY.map((el: GnbArrayList) => (
          <li key={el.label}>
            <Link
              href={el.path}
              className={`${
                pathname === el.path ? "font-bold" : "font-normal"
              }`}
            >
              {el.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigator;
