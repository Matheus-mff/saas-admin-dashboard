type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="secondary-button disabled:opacity-40"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isCurrent = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={isCurrent ? "primary-button min-w-10 px-3" : "secondary-button min-w-10 px-3"}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="secondary-button disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
