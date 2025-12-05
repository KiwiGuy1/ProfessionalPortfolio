"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CMS Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Logged in as {session.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact Messages
          </h2>

          {loading && <p className="text-gray-600">Loading messages...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          {!loading && messages.length === 0 && (
            <p className="text-gray-600">No contact messages yet.</p>
          )}

          {!loading && messages.length > 0 && (
            <div className="grid gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {msg.name}
                      </h3>
                      <p className="text-sm text-gray-600">{msg.email}</p>
                    </div>
                    <time className="text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()} at{" "}
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
