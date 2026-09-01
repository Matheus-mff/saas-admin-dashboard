"use client";

import { AlertTriangle, Bell, Clock3, CreditCard } from "lucide-react";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { getNotifications } from "@/services/notificationService";

import { Notification, NotificationType } from "@/types/notification";

import { DASHBOARD_DATA_CHANGED } from "@/utils/dashboardEvents";

type NotificationBellProps = {
  userKey: string;
};

function getNotificationIcon(type: NotificationType) {
  if (type === "failed-payment") {
    return <AlertTriangle size={17} strokeWidth={1.8} className="text-[var(--danger)]" />;
  }

  if (type === "pending-payment") {
    return <Clock3 size={17} strokeWidth={1.8} className="text-[var(--warning)]" />;
  }

  return <CreditCard size={17} strokeWidth={1.8} className="muted-text" />;
}

function getSeenNotificationsStorageKey(userKey: string) {
  return `seen-notifications:${userKey.trim().toLowerCase()}`;
}

function readSeenNotificationIds(storageKey: string) {
  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function saveSeenNotificationIds(storageKey: string, ids: string[]) {
  localStorage.setItem(storageKey, JSON.stringify(ids));
}

export default function NotificationBell({ userKey }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);

  const [total, setTotal] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const storageKey = getSeenNotificationsStorageKey(userKey);

  useEffect(() => {
    async function loadNotifications() {
      try {
        setErrorMessage("");

        const data = await getNotifications();

        const activeNotificationIds = data.notifications.map((notification) => notification.id);

        const activeNotificationIdSet = new Set(activeNotificationIds);

        const storedSeenIds = readSeenNotificationIds(storageKey);

        const stillActiveSeenIds = storedSeenIds.filter((id) => activeNotificationIdSet.has(id));

        if (stillActiveSeenIds.length !== storedSeenIds.length) {
          saveSeenNotificationIds(storageKey, stillActiveSeenIds);
        }

        setNotifications(data.notifications);

        setSeenNotificationIds(stillActiveSeenIds);

        setTotal(data.total);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load notifications.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotifications();

    window.addEventListener(DASHBOARD_DATA_CHANGED, loadNotifications);

    window.addEventListener("focus", loadNotifications);

    return () => {
      window.removeEventListener(DASHBOARD_DATA_CHANGED, loadNotifications);

      window.removeEventListener("focus", loadNotifications);
    };
  }, [storageKey]);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const seenNotificationIdSet = new Set(seenNotificationIds);

  const unseenCount = notifications.filter(
    (notification) => !seenNotificationIdSet.has(notification.id)
  ).length;

  const hasActiveAlerts = total > 0;

  const hasSeenActiveAlerts = hasActiveAlerts && unseenCount === 0;

  const badgeText = unseenCount > 99 ? "99+" : unseenCount.toString();

  function markCurrentNotificationsAsSeen() {
    if (notifications.length === 0) {
      return;
    }

    const currentNotificationIds = notifications.map((notification) => notification.id);

    const nextSeenIds = Array.from(new Set([...seenNotificationIds, ...currentNotificationIds]));

    setSeenNotificationIds(nextSeenIds);

    saveSeenNotificationIds(storageKey, nextSeenIds);
  }

  function handleBellClick() {
    const willOpen = !isOpen;

    setIsOpen(willOpen);

    if (willOpen) {
      markCurrentNotificationsAsSeen();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="icon-button relative"
        aria-label={
          unseenCount > 0
            ? `Open notifications. ${unseenCount} unseen ${unseenCount === 1 ? "alert" : "alerts"}.`
            : total > 0
              ? `Open notifications. ${total} active ${
                  total === 1 ? "alert" : "alerts"
                }, no unseen alerts.`
              : "Open notifications"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={handleBellClick}
      >
        <Bell size={18} strokeWidth={1.8} />

        {unseenCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold leading-none text-white">
            {badgeText}
          </span>
        )}

        {hasSeenActiveAlerts && (
          <span
            className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-[var(--warning)]"
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="popover-panel absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-[12px]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="font-semibold">Notifications</h2>

              <p className="mt-0.5 text-xs muted-text">
                {total === 0
                  ? "No active alerts"
                  : `${total} active ${total === 1 ? "alert" : "alerts"}`}
              </p>
            </div>

            <Bell size={17} strokeWidth={1.8} className="muted-text" />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && <p className="p-4 text-sm muted-text">Loading notifications...</p>}

            {!isLoading && errorMessage && (
              <p className="p-4 text-sm text-[var(--danger)]" role="alert">
                {errorMessage}
              </p>
            )}

            {!isLoading && !errorMessage && notifications.length === 0 && (
              <div className="p-6 text-center">
                <Bell size={28} className="mx-auto muted-text" />

                <p className="mt-3 text-sm font-medium">Everything looks good</p>

                <p className="mt-1 text-sm muted-text">
                  There are no payment or subscription alerts.
                </p>
              </div>
            )}

            {!isLoading &&
              !errorMessage &&
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 border-b px-4 py-3.5 last:border-b-0 hover:bg-[var(--hover)]"
                >
                  <div className="mt-0.5 shrink-0">{getNotificationIcon(notification.type)}</div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>

                    <p className="mt-1 text-sm muted-text">{notification.message}</p>
                  </div>
                </Link>
              ))}
          </div>

          {!isLoading && !errorMessage && total > 0 && (
            <div className="border-t px-4 py-3 text-center text-xs muted-text">
              Alerts stay active until the related status changes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
