/*
Auth.js creates the GET and POST functions for authentication.

GET is used to get authentication data,
such as the current session.

POST is used to perform authentication actions,
such as signing in and signing out.

This file exports those functions so Next.js can use them
for routes inside /api/auth/*.
*/

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
