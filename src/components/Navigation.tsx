import type { gnbArrayList } from "@/types";
import { gnbArray } from "@/lib/data";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav>
      <ul className="hidden lg:flex lg:gap-10 lg:items-center">
        {gnbArray.map((el: gnbArrayList) => (
          <li key={el.label}>
            <Link href={el.path}>{el.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
