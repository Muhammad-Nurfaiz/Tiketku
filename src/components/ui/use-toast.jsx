import React, { useState } from 'react';

const TOAST_LIMIT = 1;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function toast(props) {
    const id = genId();

    setToasts(prev => [...prev, { id, ...props }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);

    return {
      id,
      dismiss: () => setToasts(prev => prev.filter(t => t.id !== id)),
    };
  }

  return { toast, toasts };
}
