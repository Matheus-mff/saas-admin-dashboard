"use client";

import { useState } from "react";

import PlanForm from "@/components/forms/PlanForm/PlanForm";
import PlanTable from "@/components/plans/PlanTable/PlanTable";

import Button from "@/components/ui/Button/Button";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { usePlans } from "@/hooks/usePlans";
import { useToast } from "@/hooks/useToast";

import { Plan } from "@/types/plan";

export default function PlansPage() {
  const { canManageOperations } =
    useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState<Plan | undefined>();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const {
    plans,
    loading,
    error,
    retry,
    addPlan,
    editPlan,
  } = usePlans();

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredPlans =
    plans.filter((plan) =>
      plan.name
        .toLowerCase()
        .includes(normalizedSearch)
    );

  function closeModal() {
    setSelectedPlan(undefined);
    setIsModalOpen(false);
  }

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Plans
          </h1>

          <p className="mt-2 muted-text">
            Manage the subscription
            plans available to your
            customers.
          </p>
        </div>

        {canManageOperations && (
          <Button
            onClick={() => {
              setSelectedPlan(
                undefined
              );

              setIsModalOpen(true);
            }}
          >
            Add Plan
          </Button>
        )}
      </div>

      {plans.length > 0 && (
        <input
          type="search"
          placeholder="Search plans..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="form-control mt-8"
        />
      )}

      <div className="mt-6">
        {plans.length === 0 ? (
          <EmptyState
            title="No plans yet"
            description="No subscription plans have been created."
          />
        ) : filteredPlans.length ===
          0 ? (
          <EmptyState
            title="No plans found"
            description="Try another search term."
          />
        ) : (
          <PlanTable
            plans={filteredPlans}
            canManage={
              canManageOperations
            }
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setIsModalOpen(true);
            }}
          />
        )}
      </div>

      {canManageOperations && (
        <Modal
          open={isModalOpen}
          title={
            selectedPlan
              ? "Edit Plan"
              : "Add Plan"
          }
          onClose={closeModal}
        >
          <PlanForm
            plan={selectedPlan}
            onCancel={closeModal}
            onSubmit={async (
              plan
            ) => {
              try {
                if (selectedPlan) {
                  await editPlan(
                    selectedPlan.id,
                    plan
                  );

                  showToast(
                    "Plan updated successfully."
                  );
                } else {
                  await addPlan(plan);

                  showToast(
                    "Plan created successfully."
                  );
                }

                closeModal();
              } catch (error) {
                showToast(
                  error instanceof Error
                    ? error.message
                    : "Something went wrong.",
                  "error"
                );
              }
            }}
          />
        </Modal>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}