"use client";

import {
  createContext,
  useContext,
} from "react";

import { UserRole } from "@/constants/userRoles";

export type CurrentUser = {
  name: string;
  email: string;
  role: UserRole;
};

type CurrentUserContextValue = {
  user: CurrentUser;
  isAdmin: boolean;
  isManager: boolean;
  canManageOperations: boolean;
};

const CurrentUserContext =
  createContext<CurrentUserContextValue | null>(
    null
  );

type CurrentUserProviderProps = {
  children: React.ReactNode;
  user: CurrentUser;
};

export function CurrentUserProvider({
  children,
  user,
}: CurrentUserProviderProps) {
  const isAdmin =
    user.role === "Admin";

  const isManager =
    user.role === "Manager";

  const canManageOperations = isAdmin || isManager;

  return (
    // Every component inside these Provider tags is allowed to access this value
    <CurrentUserContext.Provider
      value={{
        user,
        isAdmin,
        isManager,
        canManageOperations,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(
      "useCurrentUser must be used inside CurrentUserProvider."
    );
  }

  return context;
}