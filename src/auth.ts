import { compare } from "bcryptjs"; // external library for working with hashed passwords
import NextAuth from "next-auth"; // authentication library 
import Credentials from "next-auth/providers/credentials"; // the Credentials authentication provider from Auth.js
import { z } from "zod"; // external validation library

import { prisma } from "@/lib/prisma"; // It is used to communicate with the database

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  // session, pages, providers and callbacks are the NextAuth config(handlers, auth, signIn, signOut)
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsedCredentials =
          loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const email =
          parsedCredentials.data.email
            .trim()
            .toLowerCase();

        const password =
          parsedCredentials.data.password;

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },

            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              passwordHash: true,
              workspaceId: true,
            },
          });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches =
          await compare(
            password,
            user.passwordHash
          );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.workspaceId =
          user.workspaceId;
      }

      return token;
    },

    async session({ session, token }) {
      if (typeof token.id !== "string") {
        return session;
      }

      const userId = Number(token.id);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return session;
      }

      const currentUser =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            workspaceId: true,
          },
        });

      if (!currentUser) {
        return session;
      }

      session.user.id =
        currentUser.id.toString();

      session.user.name =
        currentUser.name;

      session.user.email =
        currentUser.email;

      session.user.role =
        currentUser.role;

      session.user.workspaceId =
        currentUser.workspaceId;

      return session;
    },
  },
});