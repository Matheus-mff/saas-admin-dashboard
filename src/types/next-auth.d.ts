import { DefaultSession } from "next-auth";

import { UserRole } from "@/constants/userRoles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      workspaceId: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    workspaceId: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    workspaceId: number;
  }
}