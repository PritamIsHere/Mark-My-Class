const NotificationModal = ({ open, type, message, onClose }) => {
  if (!open) return null;

  const color =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : "text-orange-600";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className={`text-lg font-semibold mb-4 ${color}`}>{message}</h2>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
