import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutSteps from "@/components/cart/CheckoutSteps";
import { cartMetadata } from "@/metadata/cart/cartMetadata";

export const metadata = cartMetadata;

const page = () => {
  return (
    <section className="min-h-screen px-5 pb-28 pt-8 lg:px-8">
      <div className="mx-auto w-full max-w-container">
        <div className="flex flex-col gap-5 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[13px] font-bold tracking-[0.2em] text-orange-500">SHOPPING CART</p>
            <h1 className="mt-2 text-3xl font-bold lg:text-[34px]">장바구니</h1>
            <p className="mt-2.5 text-[15px] text-gray-500">담아둔 굿즈를 확인하고 바로 결제까지 진행해요</p>
          </div>
          <CheckoutSteps current={1} />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <CartList />
          <CartSummary />
        </div>
      </div>
    </section>
  );
};

export default page;
