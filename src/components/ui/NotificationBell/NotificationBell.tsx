"use client";

import {
  AlertTriangle,
  Bell,
  Clock3,
  CreditCard,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { getNotifications } from "@/services/notificationService";

import {
  Notification,
  NotificationType,
} from "@/types/notification";

import { DASHBOARD_DATA_CHANGED } from "@/utils/dashboardEvents";

function getNotificationIcon(
  type: NotificationType
) {
  if (
    type === "failed-payment"
  ) {
    return (
      <AlertTriangle
        size={18}
        className="text-red-500"
      />
    );
  }

  if (
    type === "pending-payment"
  ) {
    return (
      <Clock3
        size={18}
        className="text-amber-500"
      />
    );
  }

  return (
    <CreditCard
      size={18}
      className="text-blue-500"
    />
  );
}

export default function NotificationBell() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [total, setTotal] =
    useState(0);

  const [isOpen, setIsOpen] =
    useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        setErrorMessage("");

        const data =
          await getNotifications();

        setNotifications(
          data.notifications
        );

        setTotal(data.total);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load notifications."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadNotifications();

    window.addEventListener(
      DASHBOARD_DATA_CHANGED,
      loadNotifications
    );

    window.addEventListener(
      "focus",
      loadNotifications
    );

    return () => {
      window.removeEventListener(
        DASHBOARD_DATA_CHANGED,
        loadNotifications
      );

      window.removeEventListener(
        "focus",
        loadNotifications
      );
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(
      event: PointerEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const badgeText =
    total > 99
      ? "99+"
      : total.toString();

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        className="icon-button relative"
        aria-label={
          total > 0
            ? `Open notifications. ${total} active alerts.`
            : "Open notifications"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() =>
          setIsOpen(
            (current) =>
              !current
          )
        }
      >
        <Bell size={20} />

        {total > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {badgeText}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="navigation-surface absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-xl border shadow-lg"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="font-semibold">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs muted-text">
                {total === 0
                  ? "No active alerts"
                  : `${total} active ${total === 1
                    ? "alert"
                    : "alerts"
                  }`}
              </p>
            </div>

            <Bell
              size={18}
              className="muted-text"
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <p className="p-4 text-sm muted-text">
                Loading notifications...
              </p>
            )}

            {!isLoading &&
              errorMessage && (
                <p
                  className="p-4 text-sm text-red-500"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}

            {!isLoading &&
              !errorMessage &&
              notifications.length ===
              0 && (
                <div className="p-6 text-center">
                  <Bell
                    size={28}
                    className="mx-auto muted-text"
                  />

                  <p className="mt-3 text-sm font-medium">
                    Everything looks
                    good
                  </p>

                  <p className="mt-1 text-sm muted-text">
                    There are no payment
                    or subscription
                    alerts.
                  </p>
                </div>
              )}

            {!isLoading &&
              !errorMessage &&
              notifications.map(
                (notification) => (
                  <Link
                    key={
                      notification.id
                    }
                    href={
                      notification.href
                    }
                    onClick={() =>
                      setIsOpen(
                        false
                      )
                    }
                    className="flex gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--surface-secondary)]"
                  >
                    <div className="mt-0.5 shrink-0">
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {
                          notification.title
                        }
                      </p>

                      <p className="mt-1 text-sm muted-text">
                        {
                          notification.message
                        }
                      </p>
                    </div>
                  </Link>
                )
              )}
          </div>

          {total >
            notifications.length && (
              <div className="border-t px-4 py-3 text-center text-xs muted-text">
                Showing the first{" "}
                {
                  notifications.length
                }{" "}
                of {total} alerts.
              </div>
            )}
        </div>
      )}
    </div>
  );
}