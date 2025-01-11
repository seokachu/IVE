import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";

const page = () => {
  return (
    <section className="px-0 pt-14 pb-28 lg:px-8 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <div className="max-w-[1320px] w-full m-auto flex flex-col lg:flex-row gap-5">
        <CartList />
        <CartSummary />
      </div>
    </section>
  );
};

export default page;
