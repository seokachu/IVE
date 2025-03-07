import NewsCategoryFilter from "./NewsCategoryFilter";
import NewsGallery from "./NewsGallery";

const LatestNewsSection = () => {
  return (
    <section>
      <h2>Latest News</h2>
      <h3>아이브의 새로운 소식을 가장 먼저 만나보세요.</h3>
      <NewsCategoryFilter />
      <NewsGallery />
      <button>더보기</button>
    </section>
  );
};

export default LatestNewsSection;
