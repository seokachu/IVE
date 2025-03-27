import { NEWS_CATEGORY_ARRAY } from "@/utils/constants";
import type { NewsCategoryFilterProps } from "@/types/news";

const NewsCategoryFilter = ({ selectedCategory, setSelectedCategory }: NewsCategoryFilterProps) => {
  return (
    <nav aria-label="IVE 뉴스 카테고리" className="flex justify-center items-center">
      <ul className="flex items-center gap-2 p-1 bg-gray-100 rounded-full text-gray-600 overflow-x-auto scrollbar-hide">
        {NEWS_CATEGORY_ARRAY.map((el) => (
          <li
            key={el.category}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm ${
              selectedCategory === el.category ? "bg-white" : ""
            }`}
          >
            <button
              onClick={() => setSelectedCategory(el.category)}
              className={`hover:text-font-color ${selectedCategory === el.category ? "text-purple" : ""}`}
            >
              {el.category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NewsCategoryFilter;
