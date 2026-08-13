"use client";

import { useState } from "react";

import TransactionTable from "@/components/transactions/TransactionTable/TransactionTable";

import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";

import {
  TRANSACTION_STATUS_FILTERS,
  TransactionStatusFilter,
} from "@/constants/transactionStatuses";

import { useTransactions } from "@/hooks/useTransactions";

const TRANSACTIONS_PER_PAGE = 10;

export default function TransactionsPage() {
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
    useState<TransactionStatusFilter>(
      "All"
    );

  const {
    transactions,
    loading,
    error,
    retry,
  } = useTransactions();

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const matchesSearch = [
          transaction.id.toString(),
          transaction.subscription
            .customer.name,
          transaction.subscription
            .customer.email,
          transaction.subscription
            .customer.company ?? "",
          transaction.subscription
            .plan.name,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(
              normalizedSearch
            )
        );

        const matchesStatus =
          statusFilter === "All" ||
          transaction.status ===
          statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const totalPages = Math.ceil(
    filteredTransactions.length /
    TRANSACTIONS_PER_PAGE
  );

  const validCurrentPage =
    Math.min(
      currentPage,
      Math.max(totalPages, 1)
    );

  const startIndex =
    (validCurrentPage - 1) *
    TRANSACTIONS_PER_PAGE;

  const paginatedTransactions =
    filteredTransactions.slice(
      startIndex,
      startIndex +
      TRANSACTIONS_PER_PAGE
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
        Transactions
      </h1>

      <p className="mt-2 muted-text">
        Review subscription payments
        and transaction statuses.
      </p>

      {transactions.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {TRANSACTION_STATUS_FILTERS.map(
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
            placeholder="Search by customer, plan, or transaction ID..."
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
        {transactions.length ===
          0 ? (
          <EmptyState
            title="No transactions yet"
            description="No transactions are available in this workspace."
          />
        ) : filteredTransactions.length ===
          0 ? (
          <EmptyState
            title="No transactions found"
            description="Try another search or status."
          />
        ) : (
          <>
            <TransactionTable
              transactions={
                paginatedTransactions
              }
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
    </div>
  );
}