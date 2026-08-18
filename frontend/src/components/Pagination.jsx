export function Pagination({
  page,
  total,
  limit,
  onPageChange,
}) {
  const totalPages = Math.ceil(total / limit);

  // If there are no tasks or only one page,
  // there is nothing to paginate.
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    onPageChange(newPage);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Previous */}
      <button
        type="button"
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="border rounded px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => handlePageChange(pageNumber)}
            className={`min-w-9 px-3 py-1 border rounded ${
              pageNumber === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="border rounded px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}