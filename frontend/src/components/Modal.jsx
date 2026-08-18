

export function Modal({ open, onClose, title, children }) {
  // Do not render anything if the modal is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mb-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Title */}
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

        {/* Modal Body / Children */}
        {children}
      </div>
    </div>
  );
}