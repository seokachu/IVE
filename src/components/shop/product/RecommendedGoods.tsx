"use client";
import { useParams } from "next/navigation";
import ShopListItem from "@/components/shop/ShopListItem";
import MoreLink from "@/components/common/MoreLink";
import { useShops } from "@/hooks/queries/useShops";
import { sortGoods } from "@/lib/supabase/shop";

const RECOMMEND_COUNT = 6;

//시안 기준: 탭 콘텐츠와 FAQ 사이 추천 섹션 — 베스트 정렬에서 현재 상품 제외, 컴팩트 6열
const RecommendedGoods = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: goods } = useShops();

  const recommended = sortGoods(goods ?? [], "best")
    .filter((item) => item.id !== id)
    .slice(0, RECOMMEND_COUNT);

  if (recommended.length === 0) return null;

  return (
    //시안 기준: 히어로와 호응하는 purple-50 풀블리드 밴드 배경
    <section className="w-full bg-purple-50">
      <div className="m-auto max-w-container px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-bold lg:text-xl">이런 굿즈는 어때요?</h2>
            <p className="text-[13px] text-gray-500">지금 인기 있는 굿즈를 모았어요</p>
          </div>
          <MoreLink href="/shop" label="굿즈샵 더보기" />
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 lg:grid-cols-6 lg:gap-4">
          {recommended.map((item) => (
            <ShopListItem key={item.id} item={item} variant="shop" />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RecommendedGoods;
