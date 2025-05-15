import { getGoodsShopDetail } from "@/lib/supabase/shop";
import type { ShopDetailPageParams } from "@/types/shop";

const fallbackMetadata = {
  title: "굿즈샵 상세페이지 - IVE DIVE",
  description: "IVE DIVE - 굿즈샵 샹세정보 페이지 입니다.",
  openGraph: {
    title: "굿즈샵 상세페이지 - IVE DIVE",
    description: "IVE DIVE - 굿즈샵 샹세정보 페이지 입니다.",
    images: [
      "https://res.cloudinary.com/dknj7kdek/image/upload/v1737888335/og_nb8ueg.png",
    ],
    type: "website",
  },
};

export const generateMetadata = async ({ params }: ShopDetailPageParams) => {
  try {
    const shopId = params.id;
    const shopData = await getGoodsShopDetail(shopId);

    if (!shopData) return fallbackMetadata;

    return {
      title: `${shopData.title} - 굿즈샵 상세페이지`,
      description: shopData.description ?? "굿즈 상세 설명입니다.",
      openGraph: {
        title: `${shopData.title} - 굿즈샵 상세페이지`,
        description: shopData.description ?? "굿즈 상세 설명입니다.",
        images: [shopData.thumbnail],
        type: "website",
      },
    };
  } catch (err) {
    console.error("메타데이터 에러:", err);
    return fallbackMetadata;
  }
};
