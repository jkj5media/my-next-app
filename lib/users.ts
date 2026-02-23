// lib/users.ts

export type User = {
  id: number;
  email: string;
  passwordHash: string;
};

// TEMP: in‑memory store, will reset on server restart
export const users: User[] = [];
