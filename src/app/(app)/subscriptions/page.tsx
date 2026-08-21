"use client";

import { useState } from "react";

import SubscriptionTable from "@/components/subscriptions/SubscriptionTable/SubscriptionTable";

import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import {
  SUBSCRIPTION_STATUS_FILTERS,
  SubscriptionStatusFilter,
} from "@/constants/subscriptionStatuses";

import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/useToast";

import { SortDirection, SubscriptionSortField } from "@/types/sort";
import { Subscription } from "@/types/subscription";

import { matchesSearch } from "@/utils/matchesSearch";

const SUBSCRIPTIONS_PER_PAGE = 10;

function getSubscriptionSortValue(
  subscription: Subscription,
  field: SubscriptionSortField
): string | number {
  switch (field) {
    case "customer":
      return subscription.customer.name;
    case "plan":
      return subscription.plan.name;
    case "price":
      return subscription.plan.monthlyPrice;
    case "started":
      return new Date(subscription.startedAt).getTime();
    case "status":
      return subscription.status;
  }
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatusFilter>("All");
  const [sortField, setSortField] = useState<SubscriptionSortField>("started");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { canManageOperations } = useCurrentUser();

  const { subscriptions, loading, error, retry, changeSubscriptionStatus } = useSubscriptions();

  const { toastMessage, toastType, showToast } = useToast();

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearchTerm = matchesSearch(search, [
      subscription.customer.name,
      subscription.customer.email,
      subscription.customer.company,
      subscription.plan.name,
    ]);

    const matchesStatus = statusFilter === "All" || subscription.status === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    const valueA = getSubscriptionSortValue(a, sortField);
    const valueB = getSubscriptionSortValue(b, sortField);

    const comparison =
      typeof valueA === "number" && typeof valueB === "number"
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / SUBSCRIPTIONS_PER_PAGE);

  const validCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (validCurrentPage - 1) * SUBSCRIPTIONS_PER_PAGE;

  const paginatedSubscriptions = sortedSubscriptions.slice(
    startIndex,
    startIndex + SUBSCRIPTIONS_PER_PAGE
  );

  function handleSort(field: SubscriptionSortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      setCurrentPage(1);

      return;
    }

    setSortField(field);
    setSortDirection("asc");
    setCurrentPage(1);
  }

  if (loading) {
    return <TableSkeleton columns={5} showFilters showSearch />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <h1 className="page-title">Subscriptions</h1>

      <p className="page-description">View customer subscriptions, plans, and current statuses.</p>

      {subscriptions.length > 0 && (
        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {SUBSCRIPTION_STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);

                  setCurrentPage(1);
                }}
                className={`filter-chip ${statusFilter === status ? "filter-chip-active" : ""}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="w-full lg:max-w-md">
            <SearchInput
              placeholder="Search subscriptions..."
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        {subscriptions.length === 0 ? (
          <EmptyState
            title="No subscriptions yet"
            description="No subscriptions are available in this workspace."
          />
        ) : filteredSubscriptions.length === 0 ? (
          <EmptyState title="No subscriptions found" description="Try another search or status." />
        ) : (
          <>
            <SubscriptionTable
              subscriptions={paginatedSubscriptions}
              sortField={sortField}
              sortDirection={sortDirection}
              canManage={canManageOperations}
              onSort={handleSort}
              onStatusChange={async (id, status) => {
                try {
                  await changeSubscriptionStatus(id, status);

                  showToast("Subscription updated successfully.");
                } catch (error) {
                  showToast(
                    error instanceof Error ? error.message : "Unable to update subscription.",
                    "error"
                  );
                }
              }}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
