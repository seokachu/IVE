import SelectMenu from "@/components/common/select/SelectMenu";
import ShopListItems from "@/components/shop/ShopListItems";

const page = () => {
  const productSortOptions = [
    { value: "best", title: "인기순" },
    { value: "latest", title: "최신순" },
  ];

  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
        <div className="flex justify-between mb-8 flex-col lg:flex-row gap-5">
          <h2 className="text-2xl font-bold">굿즈샵</h2>
          <SelectMenu options={productSortOptions} />
        </div>
        <ul className="flex items-center justify-between flex-wrap">
          <ShopListItems />
          <ShopListItems />
          <ShopListItems />
          <ShopListItems />
          <ShopListItems />
        </ul>
      </section>
    </main>
  );
};

export default page;
