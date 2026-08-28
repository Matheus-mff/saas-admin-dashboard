"use client";

import { useState } from "react";

import { Plan, PlanInput } from "@/types/plan";

type PlanFormProps = {
  plan?: Plan;
  onSubmit: (plan: PlanInput) => void | Promise<void>;
  onCancel: () => void;
};

export default function PlanForm({ plan, onSubmit, onCancel }: PlanFormProps) {
  const [name, setName] = useState(plan?.name ?? "");
  const [monthlyPrice, setMonthlyPrice] = useState(plan?.monthlyPrice.toString() ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    monthlyPrice: "",
  });

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const parsedPrice = Number(monthlyPrice);

    const nextErrors = {
      name: "",
      monthlyPrice: "",
    };

    if (!trimmedName) {
      nextErrors.name = "Plan name is required.";
    } else if (trimmedName.length > 100) {
      nextErrors.name = "Plan name is too long.";
    }

    if (!monthlyPrice || !Number.isFinite(parsedPrice)) {
      nextErrors.monthlyPrice = "Enter a valid monthly price.";
    } else if (parsedPrice <= 0) {
      nextErrors.monthlyPrice = "Monthly price must be greater than zero.";
    }

    if (nextErrors.name || nextErrors.monthlyPrice) {
      setErrors(nextErrors);

      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: trimmedName,
        monthlyPrice: parsedPrice,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label htmlFor="plan-name" className="mb-2 block text-sm font-semibold">
          Name
        </label>

        <input
          id="plan-name"
          type="text"
          value={name}
          maxLength={100}
          disabled={isSubmitting}
          onChange={(e) => {
            setName(e.target.value);

            if (errors.name) {
              setErrors((prev) => ({
                ...prev,
                name: "",
              }));
            }
          }}
          className={`form-control ${errors.name ? "form-control-error" : ""}`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="plan-price" className="mb-2 block text-sm font-semibold">
          Monthly price
        </label>

        <input
          id="plan-price"
          type="number"
          min="0.01"
          step="0.01"
          value={monthlyPrice}
          disabled={isSubmitting}
          onChange={(e) => {
            setMonthlyPrice(e.target.value);

            if (errors.monthlyPrice) {
              setErrors((prev) => ({
                ...prev,
                monthlyPrice: "",
              }));
            }
          }}
          className={`form-control ${errors.monthlyPrice ? "form-control-error" : ""}`}
        />

        {errors.monthlyPrice && (
          <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
            {errors.monthlyPrice}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="secondary-button"
        >
          Cancel
        </button>

        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? "Saving..." : plan ? "Save Changes" : "Create Plan"}
        </button>
      </div>
    </form>
  );
}
