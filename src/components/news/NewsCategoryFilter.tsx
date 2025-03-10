import { NEWS_CATEGORY_ARRAY } from "@/utils/constants";
import { Dispatch, SetStateAction } from "react";

interface NewsCategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

const NewsCategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: NewsCategoryFilterProps) => {
  return (
    <nav
      aria-label="IVE 뉴스 카테고리"
      className="flex justify-center items-center"
    >
      <ul className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-full text-gray-600">
        {NEWS_CATEGORY_ARRAY.map((el) => (
          <li
            key={el.category}
            className={`px-6 py-2 rounded-full text-sm ${
              selectedCategory === el.category ? "bg-white" : ""
            }`}
          >
            <button
              onClick={() => setSelectedCategory(el.category)}
              className={`hover:text-font-color ${
                selectedCategory === el.category ? "text-purple" : ""
              }`}
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
