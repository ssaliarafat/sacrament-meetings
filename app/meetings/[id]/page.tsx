
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";
import { Suspense } from "react";

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}


async function MeetingPageContent({
  params,
}: MeetingPageProps) {
  const { id } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!host) {
    throw new Error("Unable to determine the request host.");
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? "http";

  const response = await fetch(
    `${protocol}://${host}/api/meetings/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 404 || response.status === 400) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load this meeting.");
  }

  const meeting: SacramentMeeting = await response.json();

  return (
    <div className="space-y-6">
      <Link
        href="/meetings"
        className="inline-block font-semibold text-emerald-700 hover:underline"
      >
        ← Back to all meetings
      </Link>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading meeting program...</p>}>
      <MeetingPageContent params={params} />
    </Suspense>
  );
}