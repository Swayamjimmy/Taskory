export function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);

  // No pagination needed for zero or one page
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (newPage) => {
    // Never allow navigation outside the valid range
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    onPageChange(newPage);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Previous button */}
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="border rounded px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => goToPage(pageNumber)}
              className={`min-w-9 px-3 py-1 border rounded ${
                pageNumber === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="border rounded px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}