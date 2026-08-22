import DiscographyList from "@/components/discography/DiscographyList";
import GoTopButton from "@/components/common/button/GoTopButton";
import { fetchItunesReleases } from "@/lib/album/sync";
import { discographyMetadata } from "@/metadata/discography/discographyMetadata";

export const metadata = discographyMetadata;
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
