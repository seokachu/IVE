import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxDisplayPages: number;
}

const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayPages,
}: PaginationControlProps) => {
  const getPageNumbers = () => {
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxDisplayPages) {
      // 전체 페이지가 maxDisplayPages 이하면 모든 페이지 표시
      startPage = 1;
      endPage = totalPages;
    } else {
      // maxDisplayPages/2 만큼 현재 페이지 좌우로 표시
      const halfDisplay = Math.floor(maxDisplayPages / 2);

      if (currentPage <= halfDisplay) {
        // 시작 부분
        startPage = 1;
        endPage = maxDisplayPages;
      } else if (currentPage + halfDisplay >= totalPages) {
        // 끝 부분
        startPage = totalPages - maxDisplayPages + 1;
        endPage = totalPages;
      } else {
        // 중간
        startPage = currentPage - halfDisplay;
        endPage = currentPage + halfDisplay;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pages = getPageNumbers();

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControl;
