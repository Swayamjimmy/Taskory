import { useEffect } from 'react';

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden flex flex-col transform transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-700/80">
          {title ? (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          ) : (
            <div /> /* Empty div to push the close button to the right if there is no title */
          )}
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-5 sm:p-6 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
}