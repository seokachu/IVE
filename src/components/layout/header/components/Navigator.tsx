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
            {/* 시안 기준: 활성 = primary·semibold, 비활성 = secondary 톤(투명 헤더 흰 글자에서도 동작하도록 opacity로 표현) */}
            <Link
              href={el.path}
              className={`transition-opacity ${
                isActivePath(el.path, el.exact) ? "font-semibold" : "opacity-60 hover:opacity-100"
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
