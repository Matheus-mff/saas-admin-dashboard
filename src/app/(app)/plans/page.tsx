"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { canManageOperations } = useCurrentUser();

  const { toastMessage, toastType, showToast } = useToast();

  const { plans, loading, error, retry, addPlan, editPlan } = usePlans();

  function closeModal() {
    setSelectedPlan(undefined);
    setIsModalOpen(false);
  }

  if (loading) {
    return <TableSkeleton columns={canManageOperations ? 4 : 3} showAction={canManageOperations} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Plans</h1>

          <p className="page-description">
            Manage the subscription plans available to your customers.
          </p>
        </div>

        {canManageOperations && (
          <Button
            onClick={() => {
              setSelectedPlan(undefined);

              setIsModalOpen(true);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={15} strokeWidth={2} />
              Add Plan
            </span>
          </Button>
        )}
      </div>

      <div className="mt-7">
        {plans.length === 0 ? (
          <EmptyState title="No plans yet" description="No subscription plans have been created." />
        ) : (
          <PlanTable
            plans={plans}
            canManage={canManageOperations}
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
          title={selectedPlan ? "Edit Plan" : "Add Plan"}
          onClose={closeModal}
        >
          <PlanForm
            plan={selectedPlan}
            onCancel={closeModal}
            onSubmit={async (plan) => {
              try {
                if (selectedPlan) {
                  await editPlan(selectedPlan.id, plan);

                  showToast("Plan updated successfully.");
                } else {
                  await addPlan(plan);

                  showToast("Plan created successfully.");
                }

                closeModal();
              } catch (error) {
                showToast(
                  error instanceof Error ? error.message : "Something went wrong.",
                  "error"
                );
              }
            }}
          />
        </Modal>
      )}

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
