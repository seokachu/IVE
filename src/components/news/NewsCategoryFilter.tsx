import Link from "next/link";

const NewsCategoryFilter = () => {
  return (
    <nav
      aria-label="IVE 뉴스 카테고리"
      className="flex justify-center items-center"
    >
      <ul className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-full text-gray-600">
        <li className="px-6 py-2 rounded-full text-sm bg-white">
          <Link href="#">전체</Link>
        </li>
        <li className="px-6 py-2 rounded-full text-sm bg-white shadow-sm">
          <Link href="#">음악</Link>
        </li>
        <li className="px-6 py-2 rounded-full text-sm bg-white">
          <Link href="#">방송</Link>
        </li>
        <li className="px-6 py-2 rounded-full text-sm bg-white">
          <Link href="#">행사</Link>
        </li>
        <li className="px-6 py-2 rounded-full text-sm bg-white">
          <Link href="#">화보</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NewsCategoryFilter;
