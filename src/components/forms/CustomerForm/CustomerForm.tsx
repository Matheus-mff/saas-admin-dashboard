"use client";

import { useState } from "react";

import { Customer, CustomerInput } from "@/types/customer";

type CustomerFormProps = {
  customer?: Customer;
  onSubmit: (customer: CustomerInput) => void | Promise<void>;
  onCancel: () => void;
};

type CustomerFormErrors = {
  name: string;
  email: string;
  company: string;
};

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [company, setCompany] = useState(customer?.company ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<CustomerFormErrors>({
    name: "",
    email: "",
    company: "",
  });

  function validate() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();

    const nextErrors: CustomerFormErrors = {
      name: "",
      email: "",
      company: "",
    };

    if (trimmedName.length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    } else if (trimmedName.length > 100) {
      nextErrors.name = "Name is too long.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (trimmedCompany.length > 100) {
      nextErrors.company = "Company name is too long.";
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
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold">
          Name
        </label>
        <input
          id="customer-name"
          type="text"
          value={name}
          maxLength={100}
          autoComplete="name"
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

      <div className="mb-5">
        <label htmlFor="customer-email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input
          id="customer-email"
          type="email"
          value={email}
          autoComplete="email"
          disabled={isSubmitting}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }
          }}
          className={`form-control ${errors.email ? "form-control-error" : ""}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="customer-company" className="mb-2 block text-sm font-semibold">
          Company <span className="font-normal muted-text">(optional)</span>
        </label>
        <input
          id="customer-company"
          type="text"
          value={company}
          maxLength={100}
          autoComplete="organization"
          disabled={isSubmitting}
          onChange={(e) => {
            setCompany(e.target.value);

            if (errors.company) {
              setErrors((prev) => ({
                ...prev,
                company: "",
              }));
            }
          }}
          className={`form-control ${errors.company ? "form-control-error" : ""}`}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
            {errors.company}
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
          {isSubmitting ? "Saving..." : customer ? "Save Changes" : "Create Customer"}
        </button>
      </div>
    </form>
  );
}
