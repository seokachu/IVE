import type { GnbArrayList } from "@/types";
import { GNB_ARRAY } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigator = () => {
  const pathname = usePathname();

  //하위 경로 포함 체크 active
  const isActivePath = (path: string, exact: boolean) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav>
      <ul className="hidden lg:flex lg:gap-10 lg:items-center">
        {GNB_ARRAY.map((el: GnbArrayList) => (
          <li key={el.label}>
            <Link href={el.path} className={`hover:font-bold ${isActivePath(el.path, el.exact) ? "font-bold" : ""}`}>
              {el.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigator;
