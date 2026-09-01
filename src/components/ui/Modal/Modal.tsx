"use client";

import { ReactNode, useEffect } from "react";

import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay z-[70] flex items-center justify-center overflow-y-auto p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-panel max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[14px] p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="min-w-0 text-lg font-semibold tracking-[-0.02em]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="icon-button shrink-0"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
