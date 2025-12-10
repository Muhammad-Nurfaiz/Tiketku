import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const DropdownContext = createContext(null);

export function DropdownMenu({ children, className }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={"relative inline-block " + (className || '')}>
      <DropdownContext.Provider value={{ open, setOpen }}>
        {children}
      </DropdownContext.Provider>
    </div>
  );
}

export function DropdownMenuTrigger({ asChild, children, className, ...props }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  const { open, setOpen } = ctx;

  const handleClick = (e) => {
    e?.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        handleClick(e);
      },
      className: `${children.props.className || ''} ${className || ''}`,
      ...props,
    });
  }

  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, align = 'end', className, style }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  const { open } = ctx;

  if (!open) return null;

  const alignClass = align === 'start' ? 'left-0' : 'right-0';

  return (
    <div
      className={`absolute top-full mt-1 z-50 min-w-max bg-card border border-input rounded-md shadow-md ${alignClass} ${className || ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className }) {
  return <div className={`px-3 py-2 text-sm font-semibold ${className || ''}`}>{children}</div>;
}

export function DropdownMenuSeparator({ className }) {
  return <div className={`my-1 border-t ${className || ''}`} />;
}

export function DropdownMenuItem({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
