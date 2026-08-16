"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductDescription from "./ProductDescription";
import ProductInfo from "./ProductInfo";
import GoTopButton from "@/components/common/button/GoTopButton";
import { useShopDetail } from "@/hooks/queries/useShops";
import { ChevronRight } from "lucide-react";

const ProductSection = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data } = useShopDetail(id);

  return (
    <section className="w-full">
      {/* 시안 기준: 굿즈샵 › 상품명 브레드크럼 */}
      <nav aria-label="브레드크럼" className="m-auto max-w-container px-5 py-6 lg:px-8">
        <ol className="flex items-center gap-2 text-[13px]">
          <li>
            <Link href="/shop" className="text-gray-500 transition-colors hover:text-purple-500">
              굿즈샵
            </Link>
          </li>
          {data?.title && (
            <>
              <ChevronRight size={14} className="text-gray-400" aria-hidden />
              <li className="font-semibold" aria-current="page">
                {data.title}
              </li>
            </>
          )}
        </ol>
      </nav>
      <ProductInfo id={id} />
      <div className="m-auto max-w-container px-5 lg:px-8">
        <ProductDescription id={id} />
      </div>
      <GoTopButton />
    </section>
  );
};

export default ProductSection;
