"use client";
import { useParams } from "next/navigation";
import ProductDescription from "./ProductDescription";
import ProductInfo from "./ProductInfo";
import GoTopButton from "@/components/common/button/GoTopButton";

const ProductSection = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <section className="w-full">
      <ProductInfo id={id} />
      <ProductDescription id={id} />
      <GoTopButton />
    </section>
  );
};

export default ProductSection;
