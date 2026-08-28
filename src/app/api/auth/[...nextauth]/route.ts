import { handlers } from "@/auth";

// Expose the auth.js handlers through the next.js authentication route
export const { GET, POST } = handlers;
