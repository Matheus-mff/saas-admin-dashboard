import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="modal-panel w-full max-w-md rounded-xl p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="muted-text rounded-lg p-1 hover:bg-[var(--hover)]"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}