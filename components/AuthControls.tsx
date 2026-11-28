import Link from "next/link";
import { connection } from "next/server";
import { auth, signOut } from "@/auth";

export default async function AuthControls() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        Admin sign in
      </Link>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        Sign out
      </button>
    </form>
  );
}
