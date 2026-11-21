import { Suspense } from "react";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { getMeetingById, isDatabaseConfigured } from "@/lib/meetings-db";

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMeetingPage({
  params,
}: EditMeetingPageProps) {
  return (
    <Suspense
      fallback={
        <section
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600"
        >
          Loading meeting...
        </section>
      }
    >
      <EditMeetingContent params={params} />
    </Suspense>
  );
}

async function EditMeetingContent({
  params,
}: EditMeetingPageProps) {
  const { id } = await params;
  const meetingId = Number.parseInt(id, 10);

  if (
    !isDatabaseConfigured() ||
    !Number.isInteger(meetingId) ||
    meetingId <= 0
  ) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Edit Meeting</h1>
      <p className="mt-2 text-slate-600">
        Update the sacrament meeting program dated {meeting.date}.
      </p>
      <div className="mt-8">
        <MeetingForm meeting={meeting} />
      </div>
    </section>
  );
}
