// Prev/Next pagination controls with page counter
export function Pagination({ page, pages, onPageChange }) {
  return (
    <div className='flex gap-2 mt-4'>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className='px-3 py-1 border rounded disabled:opacity-50'>Prev</button>
      <span className='px-3 py-1'>{page} / {pages}</span>
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className='px-3 py-1 border rounded disabled:opacity-50'>Next</button>
    </div>
  );
}