import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, hideToast } = useUIStore();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/40',
    error: 'border-rose-500/30 bg-rose-950/40',
    info: 'border-blue-500/30 bg-blue-950/40',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-sm font-medium text-slate-200 max-w-md',
          toastType ? borderColors[toastType] : 'border-slate-800 bg-slate-900/90'
        )}
      >
        {toastType && icons[toastType]}
        <span className="flex-1">{toastMessage}</span>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
