"use client";

import { useState } from "react";

import {
  USER_ROLES,
  UserRole,
} from "@/constants/userRoles";

import {
  User,
  UserInput,
} from "@/types/user";

type UserFormProps = {
  user?: User;
  onSubmit: (user: UserInput) => void | Promise<void>;
  onCancel: () => void;
};

export default function UserForm({
  user,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole | "">(
    user?.role ?? ""
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
  });

  function validate() {
    const newErrors = {
      name: "",
      email: "",
      role: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!role) {
      newErrors.role = "Please select a role.";
    }

    setErrors(newErrors);

    return !(
      newErrors.name ||
      newErrors.email ||
      newErrors.role
    );
  }

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validate() || !role) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        role,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="user-name"
          className="mb-1 block font-medium"
        >
          Name
        </label>

        <input
          id="user-name"
          type="text"
          value={name}
          disabled={isSubmitting}
          onChange={(e) => {
            setName(e.target.value);

            if (errors.name) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                name: "",
              }));
            }
          }}
          className={`form-control ${errors.name ? "form-control-error" : ""
            }`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="user-email"
          className="mb-1 block font-medium"
        >
          Email
        </label>

        <input
          id="user-email"
          type="email"
          value={email}
          disabled={isSubmitting}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                email: "",
              }));
            }
          }}
          className={`form-control ${errors.email ? "form-control-error" : ""
            }`}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="user-role"
          className="mb-1 block font-medium"
        >
          Role
        </label>

        <select
          id="user-role"
          value={role}
          disabled={isSubmitting}
          onChange={(e) => {
            setRole(e.target.value as UserRole);

            if (errors.role) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                role: "",
              }));
            }
          }}
          className={`form-control ${errors.role ? "form-control-error" : ""
            }`}
        >
          <option value="" disabled>
            Select a role
          </option>

          {USER_ROLES.map((userRole) => (
            <option
              key={userRole}
              value={userRole}
            >
              {userRole}
            </option>
          ))}
        </select>

        {errors.role && (
          <p className="mt-1 text-sm text-red-500">
            {errors.role}
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
            : "Save User"}
        </button>
      </div>
    </form>
  );
}