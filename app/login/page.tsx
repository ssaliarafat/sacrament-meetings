import { Suspense } from "react";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

async function authenticate(formData: FormData): Promise<void> {
  "use server";

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=invalid");
    }

    throw error;
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-center text-slate-600">
          Loading sign in...
        </p>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Admin sign in</h1>
      <p className="mt-2 text-slate-600">
        Sign in to create, edit, or delete meeting programs.
      </p>

      {error === "invalid" && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Invalid email or password.
        </p>
      )}

      <form action={authenticate} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Sign in
        </button>
      </form>

      <Link
        href="/"
        className="mt-5 inline-block text-sm font-semibold text-emerald-700 hover:underline"
      >
        Return to public meetings
      </Link>
    </section>
  );
}
