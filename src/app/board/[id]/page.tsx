import { boardDetailMetadata } from '@/metadata/board/boardDetailMetadata';
import BoardDetailContainer from '@/components/board/detail/BoardDetailContainer';
import GoTopButton from '@/components/common/button/GoTopButton';
import type { BoardDetailPageParams } from '@/types/board';

export const metadata = boardDetailMetadata;

const page = ({ params }: BoardDetailPageParams) => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pb-28 lg:px-8">
        <BoardDetailContainer boardId={parseInt(params.id)} />
      </section>
      <GoTopButton />
    </main>
  );
};

export default page;
