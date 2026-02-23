"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // on successful signup, send them to login
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 320, gap: 8 }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ marginTop: 8 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </main>
  );
}
