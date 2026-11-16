
import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById, isDatabaseConfigured } from "@/lib/meetings-db";

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingPage({ params }: MeetingPageProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/meetings"
        className="inline-block font-semibold text-emerald-700 hover:underline"
      >
        ← Back to all meetings
      </Link>
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
            <p className="mt-4 font-medium text-slate-600">
              Loading meeting details...
            </p>
          </div>
        }
      >
        <MeetingPageContent params={params} />
      </Suspense>
    </div>
  );
}

async function MeetingPageContent({ params }: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number.parseInt(id, 10);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  if (!isDatabaseConfigured()) {
    notFound();
  }

  await io();
  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}
