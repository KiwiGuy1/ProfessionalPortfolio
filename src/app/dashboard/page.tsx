"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Layout handles auth redirect server-side, no client-side redirect needed

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMessages();
    }
  }, [status]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/signin" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center">
        <p className="text-slate-300">Loading dashboard...</p>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />

      <header className="relative border-b border-cyan-300/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-white">
              CMS Dashboard
            </h1>
            <p className="mt-1 text-cyan-100/80">
              Logged in as {session.user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-xl border border-rose-300/40 bg-rose-500/20 px-4 py-2 font-medium text-rose-100 transition hover:bg-rose-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.6)] sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Contact Messages
          </h2>

          {loading && <p className="text-cyan-100/70">Loading messages...</p>}
          {error && <p className="text-rose-300">Error: {error}</p>}

          {!loading && messages.length === 0 && (
            <p className="text-cyan-100/70">No contact messages yet.</p>
          )}

          {!loading && messages.length > 0 && (
            <div className="grid gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-md transition hover:border-cyan-300/40"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {msg.name}
                      </h3>
                      <p className="text-sm text-cyan-100/70">{msg.email}</p>
                    </div>
                    <time className="text-sm text-cyan-100/60">
                      {new Date(msg.createdAt).toLocaleDateString()} at{" "}
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="text-slate-200">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
