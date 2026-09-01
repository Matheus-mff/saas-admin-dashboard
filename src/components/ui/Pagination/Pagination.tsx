type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="secondary-button disabled:opacity-40"
      >
        Previous
      </button>

      <span className="px-2 text-sm muted-text sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      <div className="hidden items-center gap-1.5 sm:flex">
        {Array.from(
          {
            length: totalPages,
          },
          (_, index) => {
            const page = index + 1;

            const isCurrent = currentPage === page;

            return (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent ? "primary-button min-w-10 px-3" : "secondary-button min-w-10 px-3"
                }
              >
                {page}
              </button>
            );
          }
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="secondary-button disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
