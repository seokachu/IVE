import AlbumShowcase from "@/components/main/AlbumShowcase";
import AlbumPlayerBar from "@/components/main/AlbumPlayerBar";

const AlbumSection = () => {
  return (
    <section id="second-section" className="relative w-full bg-[#0A0A0A] overflow-hidden">
      {/* 무대 조명 무드의 오로라 글로우 */}
      <div
        aria-hidden="true"
        className="absolute -left-20 top-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(219,151,233,0.35)_0%,rgba(219,151,233,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,159,135,0.25)_0%,rgba(255,159,135,0)_70%)]"
      />
      <div className="relative max-w-content m-auto px-5 py-24 lg:py-32 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-2 text-white">
          <h2 className="text-2xl font-bold lg:text-4xl text-center">ALBUM</h2>
          <h3 className="text-center text-white/60 text-sm lg:text-base">수록곡 미리듣기와 함께 아이브의 앨범을 만나보세요</h3>
        </div>
        <AlbumShowcase />
      </div>
      <AlbumPlayerBar />
    </section>
  );
};

export default AlbumSection;
