import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuthenticatedUser(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
}
