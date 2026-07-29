import { UserRole } from "@/constants/userRoles";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type UserInput = {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
};