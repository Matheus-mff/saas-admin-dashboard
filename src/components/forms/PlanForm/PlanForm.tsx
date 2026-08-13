"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Plan,
  PlanInput,
} from "@/types/plan";

type PlanFormProps = {
  plan?: Plan;

  onSubmit: (
    plan: PlanInput
  ) => void | Promise<void>;

  onCancel: () => void;
};

export default function PlanForm({
  plan,
  onSubmit,
  onCancel,
}: PlanFormProps) {
  const [name, setName] = useState(
    plan?.name ?? ""
  );

  const [
    monthlyPrice,
    setMonthlyPrice,
  ] = useState(
    plan?.monthlyPrice.toString() ??
    ""
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [errors, setErrors] =
    useState({
      name: "",
      monthlyPrice: "",
    });

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    const parsedPrice =
      Number(monthlyPrice);

    const nextErrors = {
      name: "",
      monthlyPrice: "",
    };

    if (!trimmedName) {
      nextErrors.name =
        "Plan name is required.";
    }

    if (
      !monthlyPrice ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      nextErrors.monthlyPrice =
        "Enter a valid monthly price.";
    }

    if (
      nextErrors.name ||
      nextErrors.monthlyPrice
    ) {
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
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="plan-name"
          className="mb-1 block font-medium"
        >
          Name
        </label>

        <input
          id="plan-name"
          type="text"
          value={name}
          disabled={isSubmitting}
          onChange={(event) => {
            setName(
              event.target.value
            );

            if (errors.name) {
              setErrors(
                (previousErrors) => ({
                  ...previousErrors,
                  name: "",
                })
              );
            }
          }}
          className={`form-control ${errors.name
              ? "form-control-error"
              : ""
            }`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="plan-price"
          className="mb-1 block font-medium"
        >
          Monthly price
        </label>

        <input
          id="plan-price"
          type="number"
          min="0.01"
          step="0.01"
          value={monthlyPrice}
          disabled={isSubmitting}
          onChange={(event) => {
            setMonthlyPrice(
              event.target.value
            );

            if (
              errors.monthlyPrice
            ) {
              setErrors(
                (previousErrors) => ({
                  ...previousErrors,
                  monthlyPrice: "",
                })
              );
            }
          }}
          className={`form-control ${errors.monthlyPrice
              ? "form-control-error"
              : ""
            }`}
        />

        {errors.monthlyPrice && (
          <p className="mt-1 text-sm text-red-500">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button"
        >
          {isSubmitting
            ? "Saving..."
            : plan
              ? "Save Changes"
              : "Create Plan"}
        </button>
      </div>
    </form>
  );
}