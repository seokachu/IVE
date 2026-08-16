import type { Metadata } from "next";
import DiscographyList from "@/components/discography/DiscographyList";
import AlbumPlayerBar from "@/components/main/AlbumPlayerBar";
import GoTopButton from "@/components/common/button/GoTopButton";
import { fetchItunesReleases } from "@/lib/album/sync";

export const metadata: Metadata = {
  title: "디스코그래피 - IVE로 DIVE",
  description: "아이브(IVE)의 정규·미니·싱글 전체 발매 목록과 수록곡 미리듣기",
};
export const revalidate = 86400;

const page = async () => {
  const releases = await fetchItunesReleases();

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="max-w-content flex flex-col px-5 pt-32 pb-40 m-auto">
        <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">Discography</h2>
        <h3 className="text-center text-gray-500 mb-12">아이브의 모든 발매 — 정규 · 미니 · 싱글</h3>
        <DiscographyList items={releases} />
      </section>
      <AlbumPlayerBar />
      <GoTopButton />
    </main>
  );
};

export default page;
