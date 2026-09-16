import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AdminToastProps {
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  toasts?: ToastMessage[];
  onDismiss?: (id: string) => void;
}

export function AdminToast({
  message,
  type = 'success',
  onClose,
  toasts,
  onDismiss,
}: AdminToastProps) {
  // If array of toasts is provided
  if (toasts && onDismiss) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <SingleToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </div>
    );
  }

  // If single toast is provided
  if (message && onClose) {
    return (
      <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full pointer-events-none">
        <SingleToastItem
          toast={{ id: 'single', type, message }}
          onDismiss={onClose}
        />
      </div>
    );
  }

  return null;
}

interface SingleToastItemProps {
  key?: React.Key;
  toast: ToastMessage;
  onDismiss: () => void;
}

function SingleToastItem({ toast, onDismiss }: SingleToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isSuccess
          ? 'bg-white text-gray-900 border-emerald-200 shadow-emerald-500/10'
          : isError
          ? 'bg-white text-gray-900 border-red-200 shadow-red-500/10'
          : 'bg-white text-gray-900 border-amber-200 shadow-amber-500/10'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-[#C88A00] shrink-0" />}
        <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
