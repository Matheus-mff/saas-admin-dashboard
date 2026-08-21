"use client";

import { useState } from "react";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/passwordRules";
import { USER_ROLES, UserRole } from "@/constants/userRoles";

import { User, UserInput } from "@/types/user";

type UserFormProps = {
  user?: User;
  onSubmit: (user: UserInput) => void | Promise<void>;
  onCancel: () => void;
};

type FormErrors = {
  name: string;
  email: string;
  role: string;
  password: string;
};

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const isEditing = Boolean(user);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<UserRole | "">(user?.role ?? "");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  function validate() {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      role: "",
      password: "",
    };

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Name is too long.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      newErrors.email = `Email must contain at most ${MAX_EMAIL_LENGTH} characters.`;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!role) {
      newErrors.role = "Please select a role.";
    }

    if (!isEditing) {
      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < MIN_PASSWORD_LENGTH) {
        newErrors.password = `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
      } else if (password.length > MAX_PASSWORD_LENGTH) {
        newErrors.password = `Password must contain at most ${MAX_PASSWORD_LENGTH} characters.`;
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validate() || !role) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        ...(!isEditing && {
          password,
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSubmitting} className="contents">
        <div className="mb-4">
          <label htmlFor="user-name" className="mb-2 block text-sm font-semibold">
            Name
          </label>

          <input
            id="user-name"
            type="text"
            autoComplete="name"
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
            className={`form-control ${errors.name ? "form-control-error" : ""}`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="user-email" className="mb-2 block text-sm font-semibold">
            Email
          </label>

          <input
            id="user-email"
            type="email"
            autoComplete="email"
            value={email}
            maxLength={MAX_EMAIL_LENGTH}
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

        <div className="mb-4">
          <label htmlFor="user-role" className="mb-2 block text-sm font-semibold">
            Role
          </label>

          <select
            id="user-role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as UserRole);

              if (errors.role) {
                setErrors((prev) => ({
                  ...prev,
                  role: "",
                }));
              }
            }}
            className={`form-control ${errors.role ? "form-control-error" : ""}`}
          >
            <option value="" disabled>
              Select a role
            </option>

            {USER_ROLES.map((userRole) => (
              <option key={userRole} value={userRole}>
                {userRole}
              </option>
            ))}
          </select>

          {errors.role && (
            <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
              {errors.role}
            </p>
          )}
        </div>

        {!isEditing && (
          <div className="mb-6">
            <label htmlFor="user-password" className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MAX_PASSWORD_LENGTH}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
              className={`form-control ${errors.password ? "form-control-error" : ""}`}
            />

            <p className="mt-1 text-sm muted-text">The member will use this password to sign in.</p>

            {errors.password && (
              <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                {errors.password}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>

          <button type="submit" className="primary-button">
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Member"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
