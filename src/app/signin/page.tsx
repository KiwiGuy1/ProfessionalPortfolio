"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const authError = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);

    if (!result || result.error) {
      setFormError("Invalid email or password.");
      return;
    }

    router.replace(result.url || callbackUrl);
    router.refresh();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.18),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(255,154,47,0.1),transparent_38%),linear-gradient(180deg,#030201_0%,#0d0602_48%,#000000_100%)]" />

      <div className="relative w-full max-w-md rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_42px_rgba(255,122,24,0.12)] backdrop-blur-xl sm:p-8">
        <div className="mb-7">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-300/75">
            Admin Access
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-wide text-white">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-zinc-300/75">
            Enter your credentials to open the dashboard.
          </p>
        </div>

        {(formError || authError) && (
          <div className="mb-5 rounded-lg border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {formError || "Authentication failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-200/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-orange-400/20 bg-black/55 px-3 py-2.5 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-500/15"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-200/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-orange-400/20 bg-black/55 px-3 py-2.5 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-500/15"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 px-4 py-2.5 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing In..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-6 border-t border-orange-400/15 pt-4 text-center text-sm text-zinc-300/70">
          <Link href="/" className="transition hover:text-orange-200">
            Back to portfolio home
          </Link>
        </div>
      </div>
    </main>
  );
}
