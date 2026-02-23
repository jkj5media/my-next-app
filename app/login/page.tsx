"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      // store token for now (later you’d move to cookies / real session)
      localStorage.setItem("auth_token", data.token);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 320, gap: 8 }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ marginTop: 8 }}>
        Don&apos;t have an account? <a href="/signup">Sign up</a>
      </p>
    </main>
  );
}
