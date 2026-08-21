"use client";

import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SUBSCRIPTION_STATUSES, SubscriptionStatus } from "@/constants/subscriptionStatuses";
import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type SubscriptionStatusMenuProps = {
  status: SubscriptionStatus;
  customerName: string;
  onChange: (status: SubscriptionStatus) => void | Promise<void>;
};

type MenuPosition = {
  top: number;
  left: number;
};

const statusDotClass: Record<SubscriptionStatus, string> = {
  Active: "status-menu-dot-active",
  Trialing: "status-menu-dot-trialing",
  Canceled: "status-menu-dot-canceled",
};

export default function SubscriptionStatusMenu({
  status,
  customerName,
  onChange,
}: SubscriptionStatusMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 126;
    const gap = 6;
    const viewportPadding = 8;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - menuWidth / 2, viewportPadding),
      window.innerWidth - menuWidth - viewportPadding
    );

    const opensAbove = rect.bottom + gap + menuHeight > window.innerHeight;

    setPosition({
      top: opensAbove ? rect.top - gap - menuHeight : rect.bottom + gap,
      left,
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
        className={`status-menu-trigger ${getSubscriptionStatusClass(status)}`}
        aria-label={`Change status for ${customerName}`}
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
        <span>{status}</span>
        <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={`Subscription status for ${customerName}`}
            className="popover-panel z-[90] w-40 rounded-[10px] p-1.5"
            style={{ position: "fixed", top: position.top, left: position.left }}
          >
            {SUBSCRIPTION_STATUSES.map((option) => (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={status === option}
                className="status-menu-option"
                onClick={() => {
                  setIsOpen(false);

                  if (option !== status) {
                    void onChange(option);
                  }
                }}
              >
                <span className={`status-menu-dot ${statusDotClass[option]}`} aria-hidden="true" />
                <span className="flex-1">{option}</span>
                {status === option && <Check size={14} strokeWidth={2} aria-hidden="true" />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
