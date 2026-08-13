"use client";

import { useState } from "react";

import SubscriptionTable from "@/components/subscriptions/SubscriptionTable/SubscriptionTable";

import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import {
  SUBSCRIPTION_STATUS_FILTERS,
  SubscriptionStatusFilter,
} from "@/constants/subscriptionStatuses";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/useToast";

const SUBSCRIPTIONS_PER_PAGE = 10;

export default function SubscriptionsPage() {
  const { canManageOperations } =
    useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<SubscriptionStatusFilter>(
      "All"
    );

  const {
    subscriptions,
    loading,
    error,
    retry,
    changeSubscriptionStatus,
  } = useSubscriptions();

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredSubscriptions =
    subscriptions.filter(
      (subscription) => {
        const matchesSearch = [
          subscription.customer.name,
          subscription.customer.email,
          subscription.customer
            .company ?? "",
          subscription.plan.name,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(
              normalizedSearch
            )
        );

        const matchesStatus =
          statusFilter === "All" ||
          subscription.status ===
          statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const totalPages = Math.ceil(
    filteredSubscriptions.length /
    SUBSCRIPTIONS_PER_PAGE
  );

  const validCurrentPage =
    Math.min(
      currentPage,
      Math.max(totalPages, 1)
    );

  const startIndex =
    (validCurrentPage - 1) *
    SUBSCRIPTIONS_PER_PAGE;

  const paginatedSubscriptions =
    filteredSubscriptions.slice(
      startIndex,
      startIndex +
      SUBSCRIPTIONS_PER_PAGE
    );

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Subscriptions
      </h1>

      <p className="mt-2 muted-text">
        View customer subscriptions,
        plans, and current statuses.
      </p>

      {subscriptions.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {SUBSCRIPTION_STATUS_FILTERS.map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setStatusFilter(
                      status
                    );

                    setCurrentPage(1);
                  }}
                  className={
                    statusFilter ===
                      status
                      ? "primary-button"
                      : "secondary-button"
                  }
                >
                  {status}
                </button>
              )
            )}
          </div>

          <input
            type="search"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );

              setCurrentPage(1);
            }}
            className="form-control"
          />
        </div>
      )}

      <div className="mt-6">
        {subscriptions.length ===
          0 ? (
          <EmptyState
            title="No subscriptions yet"
            description="No subscriptions are available in this workspace."
          />
        ) : filteredSubscriptions.length ===
          0 ? (
          <EmptyState
            title="No subscriptions found"
            description="Try another search or status."
          />
        ) : (
          <>
            <SubscriptionTable
              subscriptions={
                paginatedSubscriptions
              }
              canManage={
                canManageOperations
              }
              onStatusChange={async (
                id,
                status
              ) => {
                try {
                  await changeSubscriptionStatus(
                    id,
                    status
                  );

                  showToast(
                    "Subscription updated successfully."
                  );
                } catch (error) {
                  showToast(
                    error instanceof Error
                      ? error.message
                      : "Unable to update subscription.",
                    "error"
                  );
                }
              }}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={
                  validCurrentPage
                }
                totalPages={
                  totalPages
                }
                onPageChange={
                  setCurrentPage
                }
              />
            )}
          </>
        )}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}