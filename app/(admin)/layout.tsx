import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-center text-slate-600">
          Checking admin access...
        </p>
      }
    >
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}

async function AdminContent({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <div className="space-y-6">{children}</div>;
}
