"use client";

import { useEffect, useState } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isConfirming) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isConfirming, onCancel]);

  async function handleConfirm() {
    if (isConfirming) return;

    setIsConfirming(true);

    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  }

  function handleCancel() {
    if (isConfirming) return;

    onCancel();
  }

  if (!open) return null;

  return (
    <div
      className="modal-overlay z-[70] flex items-center justify-center overflow-y-auto p-3 sm:p-4"
      onClick={handleCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="modal-panel max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[14px] p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold tracking-[-0.02em]">
          {title}
        </h2>

        <p id="confirm-modal-message" className="mt-3 muted-text">
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isConfirming}
            className="secondary-button w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="w-full rounded-lg border border-[var(--danger)] bg-[var(--danger)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isConfirming ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
