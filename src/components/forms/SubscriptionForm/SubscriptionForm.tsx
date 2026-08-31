"use client";

import { useEffect, useState } from "react";

import { getCustomers } from "@/services/customerService";
import { getPlans } from "@/services/planService";

import { Customer } from "@/types/customer";
import { Plan } from "@/types/plan";
import { CreatableSubscriptionStatus, SubscriptionInput } from "@/types/subscription";

const STARTING_STATUSES: CreatableSubscriptionStatus[] = ["Active", "Trialing"];

type SubscriptionFormProps = {
  onSubmit: (subscription: SubscriptionInput) => void | Promise<void>;
  onCancel: () => void;
};

type SubscriptionFormErrors = {
  customerId: string;
  planId: string;
};

function getEligibleCustomers(customers: Customer[]) {
  return customers.filter(
    (customer) => !customer.latestSubscription || customer.latestSubscription.status === "Canceled"
  );
}

export default function SubscriptionForm({ onSubmit, onCancel }: SubscriptionFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [planId, setPlanId] = useState("");
  const [status, setStatus] = useState<CreatableSubscriptionStatus>("Active");
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SubscriptionFormErrors>({
    customerId: "",
    planId: "",
  });

  function applyOptions(customerData: Customer[], planData: Plan[]) {
    const eligibleCustomers = getEligibleCustomers(customerData);

    setCustomers(eligibleCustomers);
    setPlans(planData);
    setCustomerId(eligibleCustomers[0]?.id.toString() ?? "");
    setPlanId(planData[0]?.id.toString() ?? "");
  }

  async function retryOptions() {
    setIsLoadingOptions(true);
    setLoadError("");

    try {
      const [customerData, planData] = await Promise.all([getCustomers(), getPlans()]);
      applyOptions(customerData, planData);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load subscription options.");
    } finally {
      setIsLoadingOptions(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCustomers(), getPlans()])
      .then(([customerData, planData]) => {
        if (cancelled) return;

        const eligibleCustomers = getEligibleCustomers(customerData);

        setCustomers(eligibleCustomers);
        setPlans(planData);
        setCustomerId(eligibleCustomers[0]?.id.toString() ?? "");
        setPlanId(planData[0]?.id.toString() ?? "");
      })
      .catch((error) => {
        if (cancelled) return;

        setLoadError(
          error instanceof Error ? error.message : "Unable to load subscription options."
        );
      })
      .finally(() => {
        if (cancelled) return;

        setIsLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function validate() {
    const nextErrors: SubscriptionFormErrors = {
      customerId: "",
      planId: "",
    };

    if (!customerId) {
      nextErrors.customerId = "Please select a customer.";
    }

    if (!planId) {
      nextErrors.planId = "Please select a plan.";
    }

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        customerId: Number(customerId),
        planId: Number(planId),
        status,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingOptions) {
    return (
      <div aria-busy="true" aria-label="Loading subscription options">
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="skeleton-block h-4 w-24 rounded" />
              <div className="skeleton-block mt-2 h-[42px] w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <p className="text-sm text-[var(--danger)]" role="alert">
          {loadError}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>
          <button type="button" onClick={retryOptions} className="primary-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasCustomers = customers.length > 0;
  const hasPlans = plans.length > 0;
  const canCreate = hasCustomers && hasPlans;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!hasCustomers && (
        <div className="mb-5 rounded-lg border p-4 text-sm">
          <p className="font-medium">No eligible customers</p>
          <p className="mt-1 muted-text">
            Create a customer first, or cancel their current Active/Trialing subscription before
            starting a new one.
          </p>
        </div>
      )}

      {!hasPlans && (
        <div className="mb-5 rounded-lg border p-4 text-sm">
          <p className="font-medium">No plans available</p>
          <p className="mt-1 muted-text">Create a plan before adding a subscription.</p>
        </div>
      )}

      {canCreate && (
        <>
          <div className="mb-5">
            <label htmlFor="subscription-customer" className="mb-2 block text-sm font-semibold">
              Customer
            </label>
            <select
              id="subscription-customer"
              value={customerId}
              disabled={isSubmitting}
              onChange={(e) => {
                setCustomerId(e.target.value);

                if (errors.customerId) {
                  setErrors((prev) => ({
                    ...prev,
                    customerId: "",
                  }));
                }
              }}
              className={`form-control ${errors.customerId ? "form-control-error" : ""}`}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} — {customer.email}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs muted-text">
              Only customers without an Active or Trialing subscription are shown.
            </p>
            {errors.customerId && (
              <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                {errors.customerId}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="subscription-plan" className="mb-2 block text-sm font-semibold">
              Plan
            </label>
            <select
              id="subscription-plan"
              value={planId}
              disabled={isSubmitting}
              onChange={(e) => {
                setPlanId(e.target.value);

                if (errors.planId) {
                  setErrors((prev) => ({
                    ...prev,
                    planId: "",
                  }));
                }
              }}
              className={`form-control ${errors.planId ? "form-control-error" : ""}`}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — ${plan.monthlyPrice.toFixed(2)}/month
                </option>
              ))}
            </select>
            {errors.planId && (
              <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                {errors.planId}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="subscription-status" className="mb-2 block text-sm font-semibold">
              Starting status
            </label>
            <select
              id="subscription-status"
              value={status}
              disabled={isSubmitting}
              onChange={(e) => setStatus(e.target.value as CreatableSubscriptionStatus)}
              className="form-control"
            >
              {STARTING_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="secondary-button"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting || !canCreate} className="primary-button">
          {isSubmitting ? "Creating..." : "Create Subscription"}
        </button>
      </div>
    </form>
  );
}
