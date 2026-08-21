"use client";

import { useState } from "react";

import CustomerTable from "@/components/customers/CustomerTable/CustomerTable";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Pagination from "@/components/ui/Pagination/Pagination";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";

import { SUBSCRIPTION_STATUSES } from "@/constants/subscriptionStatuses";

import { useCustomers } from "@/hooks/useCustomers";

import { Customer } from "@/types/customer";
import { CustomerSortField, SortDirection } from "@/types/sort";

import { matchesSearch } from "@/utils/matchesSearch";

const CUSTOMERS_PER_PAGE = 10;

const CUSTOMER_STATUS_FILTERS = ["All", ...SUBSCRIPTION_STATUSES] as const;

type CustomerStatusFilter = (typeof CUSTOMER_STATUS_FILTERS)[number];

function getCustomerSortValue(customer: Customer, field: CustomerSortField): string | number {
  switch (field) {
    case "name":
      return customer.name;
    case "company":
      return customer.company ?? "";
    case "plan":
      return customer.latestSubscription?.plan.name ?? "";
    case "status":
      return customer.latestSubscription?.status ?? "";
    case "joined":
      return new Date(customer.createdAt).getTime();
  }
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<CustomerStatusFilter>("All");
  const [sortField, setSortField] = useState<CustomerSortField>("joined");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { customers, loading, error, retry } = useCustomers();

  const filteredCustomers = customers.filter((customer) => {
    const currentStatus = customer.latestSubscription?.status;

    const matchesSearchTerm = matchesSearch(search, [
      customer.name,
      customer.email,
      customer.company,
      customer.latestSubscription?.plan.name,
    ]);

    const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const valueA = getCustomerSortValue(a, sortField);
    const valueB = getCustomerSortValue(b, sortField);

    const comparison =
      typeof valueA === "number" && typeof valueB === "number"
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);

  const validCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (validCurrentPage - 1) * CUSTOMERS_PER_PAGE;

  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + CUSTOMERS_PER_PAGE);

  function handleSort(field: CustomerSortField) {
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
    return <TableSkeleton columns={5} showFilters filterCount={4} showSearch />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <h1 className="page-title">Customers</h1>

      <p className="page-description">View customers and their current subscription details.</p>

      {customers.length > 0 && (
        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {CUSTOMER_STATUS_FILTERS.map((status) => (
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
              placeholder="Search customers..."
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
        {customers.length === 0 ? (
          <EmptyState
            title="No customers yet"
            description="No customers are available in this workspace."
          />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState title="No customers found" description="Try another search term or status." />
        ) : (
          <>
            <CustomerTable
              customers={paginatedCustomers}
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
