import { useEffect } from "react";
function ToastMessage({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-message ${toast.type}`}>
      <span>{toast.text}</span>

      <button type="button" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default ToastMessage;