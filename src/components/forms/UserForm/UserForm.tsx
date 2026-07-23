"use client";

import { useState } from "react";
import { User } from "@/types/user";

type UserFormProps = {
  user?: User;

  onSubmit: (user: {
    name: string;
    email: string;
    role: string;
  }) => void;

  onCancel: () => void;
};

export default function UserForm({
  user,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "");

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
      newErrors.email = "Please enter a valid email.";
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

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name,
      email,
      role,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            if (errors.name) {
              setErrors((prev) => ({
                ...prev,
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

      {/* Email */}
      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (errors.email) {
              setErrors((prev) => ({
                ...prev,
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

      {/* Role */}
      <div className="mb-6">
        <label className="mb-1 block font-medium">
          Role
        </label>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);

            if (errors.role) {
              setErrors((prev) => ({
                ...prev,
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

          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
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
          className="secondary-button"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
        >
          Save User
        </button>
      </div>
    </form>
  );
}