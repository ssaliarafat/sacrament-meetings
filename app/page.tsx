
import Image from "next/image";
import Link from "next/link";
import { getMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";

export default function HomePage() {
  const meetings = getMeetings();
  const latestMeeting = meetings[0];

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 overflow-hidden rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Welcome to Riverside Ward
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Sacrament Meeting Planner
          </h1>
          <p className="mt-5 max-w-lg leading-7 text-slate-600">
            View meeting agendas, keep up with ward announcements, and
            access current and past sacrament meeting programs.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/meetings"
              className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Browse Meetings
            </Link>
            <Link
              href="/meetings/current"
              className="rounded-lg border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              This Sunday
            </Link>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/meeting-illustration.svg"
            alt="Illustration of a meetinghouse"
            width={900}
            height={420}
            priority
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Recent program
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Latest Meeting
            </h2>
          </div>
          <Link
            href="/meetings"
            className="font-semibold text-emerald-700 hover:underline"
          >
            View all meetings →
          </Link>
        </div>

        <MeetingCard meeting={latestMeeting} />
      </section>
    </div>
  );
}
