import { handlers } from "@/auth";

// Just use the original NextAuth handlers with direct export
// This avoids any type mismatch issues
export const { GET, POST } = handlers;

// Add a simple log to indicate this file is being loaded
console.log("NextAuth route handlers initialized");
