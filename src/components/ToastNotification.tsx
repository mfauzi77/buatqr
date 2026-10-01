import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-950 text-white border-emerald-700/60 shadow-lg';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgColor = 'bg-red-950 text-white border-red-700/60 shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950 text-white border-amber-700/60 shadow-lg';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${bgColor}`}
          >
            {icon}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-tight pt-0.5">
              {toast.text}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              title="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
