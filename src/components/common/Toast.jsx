import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Local fallback toast renderer used when SweetAlert2 is not available
  const addLocalToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const addToast = (message, type = 'success', duration = 3000) => {
    // Use local toast mechanism directly
    addLocalToast(message, type, duration);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ id, message, type, onRemove }) {
  const bgClass = type === 'success'
    ? 'bg-green-500'
    : type === 'error'
    ? 'bg-red-500'
    : type === 'warning'
    ? 'bg-yellow-500'
    : 'bg-blue-500';

  return (
    <div className={`${bgClass} text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between gap-3 min-w-max`}>
      <span>{message}</span>
      <button onClick={() => onRemove(id)} className="hover:opacity-75">×</button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
