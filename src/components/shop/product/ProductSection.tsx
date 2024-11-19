"use client";
import { useParams } from "next/navigation";
import ProductDescription from "./ProductDescription";
import ProductInfo from "./ProductInfo";

const ProductSection = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <ProductInfo id={id} />
      <ProductDescription id={id} />
    </>
  );
};

export default ProductSection;
