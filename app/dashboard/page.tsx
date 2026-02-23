"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse =
  | { id: number; email: string }
  | { error: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchMe() {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // token invalid or expired
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }

        const data: MeResponse = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("auth_token");
        router.push("/login");
      }
    }

    fetchMe();
  }, [router]);

  if (loading) return <main style={{ padding: "2rem" }}>Loading...</main>;

  if (!user || "error" in user) {
    return <main style={{ padding: "2rem" }}>Not authorized</main>;
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Logged in as {user.email}</p>
      <button onClick={handleLogout}>Log out</button>
    </main>
  );
}
