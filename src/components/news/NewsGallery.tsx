import NewsGalleryItem from "./NewsGalleryItem";

const NewsGallery = () => {
  const newsItems = [
    {
      id: 1,
      title: "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
      category: "음악",
      date: "2025년 12월 15일",
      content:
        "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
    },
    {
      id: 2,
      title: "뉴진스, 새 앨범으로 글로벌 히트",
      category: "음악",
      date: "2025년 12월 10일",
      content:
        "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
    },
    {
      id: 3,
      title: "블랙핑크, 월드투어 추가 공연 발표",
      category: "공연",
      date: "2025년 12월 5일",
      content:
        "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
    },
    {
      id: 4,
      title: "방탄소년단, 신곡 발매 소식",
      category: "음악",
      date: "2025년 11월 30일",
      content:
        "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
    },
    {
      id: 5,
      title: "에스파, 신곡 뮤직비디오 공개",
      category: "음악",
      date: "2025년 11월 25일",
      content:
        "아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최아이브, 신곡 I AM 발매 및 컴백 쇼케이스 개최",
    },
  ];

  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {newsItems.map((item, index) => (
        <NewsGalleryItem
          key={item.id}
          item={item}
          index={index}
          totalItems={newsItems.length}
        />
      ))}
    </ul>
  );
};

export default NewsGallery;
