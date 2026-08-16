import type { Metadata } from "next";
import DiscographyList from "@/components/discography/DiscographyList";
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
      <DiscographyList items={releases} />
      <GoTopButton />
    </main>
  );
};

export default page;
