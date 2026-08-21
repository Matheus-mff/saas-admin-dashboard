"use client";

import { useState } from "react";

import TransactionTable from "@/components/transactions/TransactionTable/TransactionTable";

import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";

import {
  TRANSACTION_STATUS_FILTERS,
  TransactionStatusFilter,
} from "@/constants/transactionStatuses";

import { useTransactions } from "@/hooks/useTransactions";

import { SortDirection, TransactionSortField } from "@/types/sort";
import { Transaction } from "@/types/transaction";

import { matchesSearch } from "@/utils/matchesSearch";

const TRANSACTIONS_PER_PAGE = 10;

function getTransactionSortValue(
  transaction: Transaction,
  field: TransactionSortField
): string | number {
  switch (field) {
    case "id":
      return transaction.id;
    case "customer":
      return transaction.subscription.customer.name;
    case "plan":
      return transaction.subscription.plan.name;
    case "amount":
      return transaction.amount;
    case "status":
      return transaction.status;
    case "date":
      return new Date(transaction.createdAt).getTime();
  }
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>("All");
  const [sortField, setSortField] = useState<TransactionSortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { transactions, loading, error, retry } = useTransactions();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearchTerm = matchesSearch(search, [
      transaction.id,
      `#${transaction.id}`,
      transaction.subscription.customer.name,
      transaction.subscription.customer.email,
      transaction.subscription.customer.company,
      transaction.subscription.plan.name,
    ]);

    const matchesStatus = statusFilter === "All" || transaction.status === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const valueA = getTransactionSortValue(a, sortField);
    const valueB = getTransactionSortValue(b, sortField);

    const comparison =
      typeof valueA === "number" && typeof valueB === "number"
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);

  const validCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (validCurrentPage - 1) * TRANSACTIONS_PER_PAGE;

  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE
  );

  function handleSort(field: TransactionSortField) {
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
    return <TableSkeleton columns={6} showFilters filterCount={5} showSearch />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <h1 className="page-title">Transactions</h1>

      <p className="page-description">Review subscription payments and transaction statuses.</p>

      {transactions.length > 0 && (
        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {TRANSACTION_STATUS_FILTERS.map((status) => (
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
              placeholder="Search transactions..."
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
        {transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="No transactions are available in this workspace."
          />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState title="No transactions found" description="Try another search or status." />
        ) : (
          <>
            <TransactionTable
              transactions={paginatedTransactions}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
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
    </div>
  );
}
