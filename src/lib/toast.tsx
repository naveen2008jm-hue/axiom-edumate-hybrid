import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X, Loader2 } from 'lucide-react';

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'loading';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let listeners: ToastListener[] = [];
let toastsState: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toastsState]));
}

function createToast(title: string, options?: { description?: string; duration?: number; type?: ToastType }) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastItem = {
    id,
    title,
    description: options?.description,
    type: options?.type || 'default',
    duration: options?.duration,
  };
  toastsState = [newToast, ...toastsState].slice(0, 5);
  notify();

  if (newToast.duration !== Infinity && newToast.type !== 'loading') {
    const dur = newToast.duration || 3500;
    setTimeout(() => {
      dismissToast(id);
    }, dur);
  }
  return id;
}

function dismissToast(id?: string) {
  if (id) {
    toastsState = toastsState.filter((t) => t.id !== id);
  } else {
    toastsState = [];
  }
  notify();
}

interface ToastFn {
  (title: string, options?: { description?: string; duration?: number }): string;
  success: (title: string, options?: { description?: string; duration?: number }) => string;
  error: (title: string, options?: { description?: string; duration?: number }) => string;
  info: (title: string, options?: { description?: string; duration?: number }) => string;
  loading: (title: string, options?: { description?: string }) => string;
  dismiss: (id?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => Promise<T>;
}

export const toast: ToastFn = Object.assign(
  (title: string, options?: { description?: string; duration?: number }) => {
    return createToast(title, options);
  },
  {
    success(title: string, options?: { description?: string; duration?: number }) {
      return createToast(title, { ...options, type: 'success' });
    },
    error(title: string, options?: { description?: string; duration?: number }) {
      return createToast(title, { ...options, type: 'error' });
    },
    info(title: string, options?: { description?: string; duration?: number }) {
      return createToast(title, { ...options, type: 'info' });
    },
    loading(title: string, options?: { description?: string }) {
      return createToast(title, { ...options, type: 'loading', duration: Infinity });
    },
    dismiss(id?: string) {
      dismissToast(id);
    },
    async promise<T>(
      promise: Promise<T>,
      msgs: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: any) => string);
      }
    ): Promise<T> {
      const id = createToast(msgs.loading, { type: 'loading', duration: Infinity });
      try {
        const data = await promise;
        dismissToast(id);
        const successTitle = typeof msgs.success === 'function' ? msgs.success(data) : msgs.success;
        createToast(successTitle, { type: 'success' });
        return data;
      } catch (err: any) {
        dismissToast(id);
        const errorTitle = typeof msgs.error === 'function' ? msgs.error(err) : msgs.error;
        createToast(errorTitle, { type: 'error' });
        throw err;
      }
    },
  }
);

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>(toastsState);

  useEffect(() => {
    const handler: ToastListener = (updated) => {
      setToasts(updated);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t, idx) => {
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-200"
            style={{
              transform: `translateY(-${idx * 4}px) scale(${1 - idx * 0.03})`,
              opacity: 1 - idx * 0.12,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {t.type === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                )}
                {t.type === 'error' && (
                  <AlertCircle className="w-4 h-4 text-rose-400 fill-rose-500/20" />
                )}
                {t.type === 'info' && (
                  <Info className="w-4 h-4 text-cyan-400 fill-cyan-500/20" />
                )}
                {t.type === 'loading' && (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                )}
                {t.type === 'default' && (
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white tracking-tight">{t.title}</div>
                {t.description && (
                  <div className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    {t.description}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition pressable flex-shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
