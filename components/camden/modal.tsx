"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface CamdenModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  busy?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
};

export function CamdenModal({
  open,
  onClose,
  title,
  description,
  children,
  busy = false,
  size = "md",
}: CamdenModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    const returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open && typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      returnFocus?.focus();
    };
  }, [mounted, open]);

  if (!mounted || !open) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="fixed inset-0 z-[100] m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-neutral-900 backdrop:bg-transparent"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={busy}
        onClick={onClose}
        className="fixed inset-0 size-full cursor-default bg-black/60"
      />
      <div className="pointer-events-none relative z-10 flex min-h-dvh items-end justify-center sm:items-center sm:p-4">
        <section
          className={`pointer-events-auto relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl ${sizes[size]}`}
        >
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-xl font-extrabold tracking-tight sm:text-2xl"
              >
                {title}
              </h2>
              {description && (
                <div
                  id={descriptionId}
                  className="mt-1 text-sm text-neutral-600"
                >
                  {description}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label={`Close ${title}`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div className="p-5 sm:p-6">{children}</div>
        </section>
      </div>
    </dialog>,
    document.body,
  );
}
