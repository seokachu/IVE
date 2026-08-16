const MARQUEE_ITEMS = [
  "IVE",
  "LOVE DIVE",
  "LUCID DREAM",
  "REVIVE+",
  "MINIVE",
  "I AM",
  "Kitsch",
  "After LIKE",
  "ELEVEN",
  "Baddie",
  "HEYA",
  "Accendio",
];

//히어로와 앨범 섹션 사이 트랙명 마퀴 스트립 (우→좌 무한 루프)
const MarqueeStrip = () => {
  const line = MARQUEE_ITEMS.join(" ✦ ") + " ✦ ";

  return (
    <div className="bg-[#0A0A0A] py-4 overflow-hidden" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        <span className="text-purple-300 text-lg lg:text-2xl font-bold tracking-widest pr-4">{line}</span>
        <span className="text-purple-300 text-lg lg:text-2xl font-bold tracking-widest pr-4">{line}</span>
      </div>
    </div>
  );
};

export default MarqueeStrip;
