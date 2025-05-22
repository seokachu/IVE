import { truncate } from "lodash";
import { getBoardDetail } from "@/lib/supabase/board";
import type { BoardDetailPageParams } from "@/types/board";

export const fallbackMetadata = {
  title: "자유게시판 상세정보 - IVE DIVE",
  description: "IVE DIVE - 자유게시판 상세정보 페이지 입니다.",
  openGraph: {
    title: "자유게시판 상세정보 - IVE DIVE",
    description: "IVE DIVE - 자유게시판 상세정보 페이지 입니다.",
    images: [
      "https://res.cloudinary.com/dknj7kdek/image/upload/v1737888335/og_nb8ueg.png",
    ],
    type: "website",
  },
};

export const generateMetadata = async ({ params }: BoardDetailPageParams) => {
  try {
    const boardId = Number(params.id);
    const boardData = await getBoardDetail(boardId);

    if (!boardData) return fallbackMetadata;

    //게시글 제목이 길 경우 최대 10자까지 자르기
    const title = truncate(boardData.title, {
      length: 10,
      omission: "...",
    });

    return {
      title: `${title} - IVE DIVE 자유게시판 상세페이지`,
      description: `자유게시판에 등록된 "${title}" - 게시글 입니다.`,
      openGraph: {
        title: `${title} - IVE DIVE 자유게시판 상세페이지`,
        description: `자유게시판에 등록된 "${title}" - 게시글 입니다.`,
        images: [
          boardData.thumbnail ||
            "https://res.cloudinary.com/dknj7kdek/image/upload/v1737888335/og_nb8ueg.png",
        ],
        type: "website",
      },
    };
  } catch (error) {
    console.error("메타데이터 에러:", error);
    return fallbackMetadata;
  }
};
