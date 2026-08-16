//소식 페이지 상단 히어로 — 시안 확정: 실제 단체 사진(메인과 동일 에셋)을 약한 블러 + 그라데이션 스크림으로 깔아 인물이 은은하게 비치게
const NewsHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-main-image bg-cover bg-[position:50%_22%] blur-[6px] scale-110"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/55 to-white/[0.92] dark:from-[#1B1B1F]/60 dark:to-[#1B1B1F]/95"
        aria-hidden="true"
      />
      <div className="relative max-w-content m-auto px-5 pt-14 lg:pt-20 pb-12 lg:pb-14 flex flex-col items-center text-center gap-3">
        <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] text-purple-500 dark:text-purple-300">
          NEWS &amp; SCHEDULE
        </p>
        <h1 className="text-3xl lg:text-[44px] lg:leading-tight font-bold">소식</h1>
        <p className="text-sm lg:text-base text-gray-500">아이브의 일정과 영상, 기사를 한곳에 모아 보여드려요</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-500 dark:bg-gray-100 dark:text-gray-500">
            자동 수집
          </span>
          <p className="text-xs text-gray-400">뉴스 · 영상 · 일정을 30분마다 자동으로 업데이트해요</p>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
