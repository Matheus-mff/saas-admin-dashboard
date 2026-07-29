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

type FormErrors = {
  name: string;
  email: string;
  role: string;
  password: string;
};

export default function UserForm({
  user,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const isEditing = Boolean(user);

  const [name, setName] = useState(
    user?.name ?? ""
  );

  const [email, setEmail] = useState(
    user?.email ?? ""
  );

  const [role, setRole] =
    useState<UserRole | "">(
      user?.role ?? ""
    );

  const [password, setPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({
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

    if (!name.trim()) {
      newErrors.name =
        "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!role) {
      newErrors.role =
        "Please select a role.";
    }

    if (!isEditing) {
      if (!password) {
        newErrors.password =
          "Temporary password is required.";
      } else if (
        password.length < 8
      ) {
        newErrors.password =
          "Password must contain at least 8 characters.";
      } else if (
        password.length > 100
      ) {
        newErrors.password =
          "Password is too long.";
      }
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(Boolean);
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;
    if (!validate() || !role) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: email
          .trim()
          .toLowerCase(),
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
    <form onSubmit={handleSubmit}>
      <fieldset
        disabled={isSubmitting}
        className="contents"
      >
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
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);

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
            <p
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
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
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(
                event.target.value
              );

              if (errors.email) {
                setErrors(
                  (previousErrors) => ({
                    ...previousErrors,
                    email: "",
                  })
                );
              }
            }}
            className={`form-control ${errors.email
                ? "form-control-error"
                : ""
              }`}
          />

          {errors.email && (
            <p
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="user-role"
            className="mb-1 block font-medium"
          >
            Role
          </label>

          <select
            id="user-role"
            value={role}
            onChange={(event) => {
              setRole(
                event.target
                  .value as UserRole
              );

              if (errors.role) {
                setErrors(
                  (previousErrors) => ({
                    ...previousErrors,
                    role: "",
                  })
                );
              }
            }}
            className={`form-control ${errors.role
                ? "form-control-error"
                : ""
              }`}
          >
            <option
              value=""
              disabled
            >
              Select a role
            </option>

            {USER_ROLES.map(
              (userRole) => (
                <option
                  key={userRole}
                  value={userRole}
                >
                  {userRole}
                </option>
              )
            )}
          </select>

          {errors.role && (
            <p
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.role}
            </p>
          )}
        </div>

        {!isEditing && (
          <div className="mb-6">
            <label
              htmlFor="user-password"
              className="mb-1 block font-medium"
            >
              Temporary password
            </label>

            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                if (errors.password) {
                  setErrors(
                    (previousErrors) => ({
                      ...previousErrors,
                      password: "",
                    })
                  );
                }
              }}
              className={`form-control ${errors.password
                  ? "form-control-error"
                  : ""
                }`}
            />

            <p className="mt-1 text-sm muted-text">
              The member will use this
              password to sign in.
            </p>

            {errors.password && (
              <p
                className="mt-1 text-sm text-red-500"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        )}

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
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create User"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}