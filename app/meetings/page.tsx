
import { headers } from "next/headers";
import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default async function MeetingsPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!host) {
    throw new Error("Unable to determine the request host.");
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? "http";

  const response = await fetch(
    `${protocol}://${host}/api/meetings`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load meetings.");
  }

  const meetings: SacramentMeeting[] = await response.json();

  return (
    <section>
      <div className="mb-7">
        <h2 className="text-3xl font-bold text-slate-900">
          All Meetings
        </h2>
        <p className="mt-2 text-slate-600">
          Browse current and past meeting programs.
        </p>
      </div>

      {meetings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center text-slate-600">
          No meeting programs are available.
        </p>
      )}
    </section>
  );
}
