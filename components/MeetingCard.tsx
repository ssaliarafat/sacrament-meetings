
import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Date(
    `${meeting.date}T12:00:00`,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-800">
          {meeting.meetingType} meeting
        </span>
        <span className="text-sm text-slate-500">#{meeting.id}</span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-slate-900">
        {formattedDate}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Presiding: {meeting.presiding}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Conducting: {meeting.conducting}
      </p>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        View Meeting →
      </Link>
    </article>
  );
}
