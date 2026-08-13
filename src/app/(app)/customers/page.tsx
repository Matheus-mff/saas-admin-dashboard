"use client";

import { useState } from "react";

import CustomerTable from "@/components/customers/CustomerTable/CustomerTable";

import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";

import { useCustomers } from "@/hooks/useCustomers";

const CUSTOMERS_PER_PAGE = 10;

export default function CustomersPage() {
  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const {
    customers,
    loading,
    error,
    retry,
  } = useCustomers();

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredCustomers =
    customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.company ?? "",
      ].some((value) =>
        value
          .toLowerCase()
          .includes(
            normalizedSearch
          )
      )
    );

  const totalPages = Math.ceil(
    filteredCustomers.length /
    CUSTOMERS_PER_PAGE
  );

  const validCurrentPage =
    Math.min(
      currentPage,
      Math.max(totalPages, 1)
    );

  const startIndex =
    (validCurrentPage - 1) *
    CUSTOMERS_PER_PAGE;

  const paginatedCustomers =
    filteredCustomers.slice(
      startIndex,
      startIndex +
      CUSTOMERS_PER_PAGE
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
        Customers
      </h1>

      <p className="mt-2 muted-text">
        View customers and their
        current subscription details.
      </p>

      {customers.length > 0 && (
        <input
          type="search"
          placeholder="Search customers..."
          value={search}
          onChange={(event) => {
            setSearch(
              event.target.value
            );

            setCurrentPage(1);
          }}
          className="form-control mt-8"
        />
      )}

      <div className="mt-6">
        {customers.length === 0 ? (
          <EmptyState
            title="No customers yet"
            description="No customers are available in this workspace."
          />
        ) : filteredCustomers.length ===
          0 ? (
          <EmptyState
            title="No customers found"
            description="Try another search term."
          />
        ) : (
          <>
            <CustomerTable
              customers={
                paginatedCustomers
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