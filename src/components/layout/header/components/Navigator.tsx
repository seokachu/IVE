import type { GnbArrayList } from "@/types";
import { GNB_ARRAY } from "@/utils/constants";
import Link from "next/link";

const Navigator = () => {
  return (
    <nav>
      <ul className="hidden lg:flex lg:gap-10 lg:items-center">
        {GNB_ARRAY.map((el: GnbArrayList) => (
          <li key={el.label}>
            <Link href={el.path}>{el.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigator;
