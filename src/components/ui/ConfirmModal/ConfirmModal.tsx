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
      className="modal-overlay z-[70] flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="modal-panel w-full max-w-md rounded-[14px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold tracking-[-0.02em]">
          {title}
        </h2>

        <p id="confirm-modal-message" className="mt-3 muted-text">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isConfirming}
            className="secondary-button"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="rounded-lg border border-[var(--danger)] bg-[var(--danger)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConfirming ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
