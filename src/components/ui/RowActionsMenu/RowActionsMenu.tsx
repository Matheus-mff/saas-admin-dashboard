"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { LucideIcon, MoreHorizontal } from "lucide-react";

type RowAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
  title?: string;
};

type RowActionsMenuProps = {
  label: string;
  actions: RowAction[];
};

type MenuPosition = {
  top: number;
  right: number;
};

export default function RowActionsMenu({ label, actions }: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });

    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;

    function closeMenu() {
      setIsOpen(false);
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="icon-button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openMenu();
          }
        }}
      >
        <MoreHorizontal size={18} strokeWidth={1.8} />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="popover-panel z-[80] min-w-36 rounded-[10px] p-1.5"
            style={{ position: "fixed", top: position.top, right: position.right }}
          >
            <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] muted-text">
              Actions
            </p>

            {actions.map(({ label: actionLabel, icon: Icon, onClick, tone, disabled, title }) => (
              <button
                key={actionLabel}
                type="button"
                role="menuitem"
                disabled={disabled}
                title={title}
                onClick={() => {
                  if (disabled) return;

                  setIsOpen(false);
                  onClick();
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  tone === "danger"
                    ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                    : "hover:bg-[var(--hover)]"
                }`}
              >
                <Icon size={15} strokeWidth={1.8} />
                {actionLabel}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
