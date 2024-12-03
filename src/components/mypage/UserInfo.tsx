"use client";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import UserAvatar from "../common/UserAvatar";
import Link from "next/link";
import { MYPAGE_GNB_ARRAY } from "@/utils/constants";
import { usePathname } from "next/navigation";

const UserInfo = () => {
  const session = useRecoilValue(sessionState);
  const pathname = usePathname();

  //하위 경로 포함 체크 active
  const isActivePath = (path: string, exact: boolean) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <section>
      <div>
        <UserAvatar size="xl" />
        <div className="flex justify-between mt-5">
          <h2 className="font-bold">{session?.user.user_metadata.name}</h2>
          <button className="text-sm text-white py-1 px-3 bg-purple rounded-md">
            수정
          </button>
        </div>
      </div>
      <div className="flex border-y p-5 my-5">
        <div className="w-2/4">
          <p className="text-xs text-[#495057] mb-1">글 작성수</p>
          <strong>-</strong>
        </div>
        <div className="w-2/4">
          <p className="text-xs text-[#495057] mb-1">찜</p>
          <strong>2</strong>
        </div>
      </div>
      <ul className="flex lg:flex-col gap-5 border-b lg:border-b-0 pb-5 text-center lg:text-left">
        {MYPAGE_GNB_ARRAY.map((el, index) => (
          <li key={index}>
            <Link
              href={el.path}
              className={`hover:font-bold ${
                isActivePath(el.path, el.exact) ? "font-bold" : ""
              }`}
            >
              {el.label}
            </Link>
          </li>
        ))}
        {/* <li>
          <button className="text-dark-gray text-sm">회원탈퇴</button>
        </li> */}
      </ul>
    </section>
  );
};

export default UserInfo;
