import { Suspense } from "react";
import { io } from "next/cache";
import { redirect } from "next/navigation";
import {
  getCurrentMeeting,
  getMeetingsPage,
  isDatabaseConfigured,
} from "@/lib/meetings-db";

export default function CurrentMeetingPage() {
  return (
    <Suspense
      fallback={
        <p
          role="status"
          aria-live="polite"
          className="rounded-2xl bg-white p-10 text-center font-medium text-slate-600 shadow-sm"
        >
          Finding the current meeting...
        </p>
      }
    >
      <CurrentMeetingContent />
    </Suspense>
  );
}

async function CurrentMeetingContent() {
  if (!isDatabaseConfigured()) {
    return <p>No meeting is currently available.</p>;
  }

  await io();
  const meeting = await getCurrentMeeting();

  if (!meeting) {
    const latestMeeting = (await getMeetingsPage({ page: 1, limit: 1 })).meetings[0];

    if (!latestMeeting) {
      return <p>No meeting is currently available.</p>;
    }

    redirect(`/meetings/${latestMeeting.id}`);
  }

  redirect(`/meetings/${meeting.id}`);
}

