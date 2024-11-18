"use client";
import ProductDescription from "./ProductDescription";
import ProductInfo from "./ProductInfo";

const ProductSection = ({ product }: any) => {
  return (
    <>
      <ProductInfo product={product} />
      <ProductDescription />
    </>
  );
};

export default ProductSection;
