
"use client";

import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Date(
    `${meeting.date}T12:00:00`,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="meeting-program mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Riverside Ward
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Sacrament Meeting
        </h1>
        <p className="mt-2 text-slate-500">{formattedDate}</p>
        <p className="mt-2 text-sm capitalize text-emerald-800">
          {meeting.meetingType} meeting
        </p>
      </div>

      <div className="my-8 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Presiding
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {meeting.presiding}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Conducting
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {meeting.conducting}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {meeting.announcements && meeting.announcements.length > 0 && (
          <section>
            <h2 className="agenda-heading">Announcements</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {meeting.announcements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="agenda-heading">Opening Hymn</h2>
          <p className="agenda-text">
            Hymn {meeting.openingHymn.number}: {meeting.openingHymn.title}
          </p>
        </section>

        <section>
          <h2 className="agenda-heading">Opening Prayer</h2>
          <p className="agenda-text">{meeting.openingPrayer}</p>
        </section>

        {meeting.wardBusiness.length > 0 && (
          <section>
            <h2 className="agenda-heading">Ward Business</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {meeting.wardBusiness.map((item, index) => (
                <li key={index}>{item.description}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="agenda-heading">Stake Business</h2>
          <p className="agenda-text">
            {meeting.stakeBusiness ? "Yes" : "No"}
          </p>
        </section>

        <section>
          <h2 className="agenda-heading">Sacrament Hymn</h2>
          <p className="agenda-text">
            Hymn {meeting.sacramentHymn.number}: {meeting.sacramentHymn.title}
          </p>
        </section>

        <section>
          <h2 className="agenda-heading">Speakers and Musical Numbers</h2>
          {meeting.speakers.length > 0 ? (
            <div className="mt-3 space-y-3">
              {meeting.speakers.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm capitalize text-emerald-700">
                    {item.type === "speaker" ? "Speaker" : "Musical Number"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.topic}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="agenda-text">No speakers or musical numbers listed.</p>
          )}
        </section>

        <section>
          <h2 className="agenda-heading">Closing Hymn</h2>
          <p className="agenda-text">
            Hymn {meeting.closingHymn.number}: {meeting.closingHymn.title}
          </p>
        </section>

        <section>
          <h2 className="agenda-heading">Closing Prayer</h2>
          <p className="agenda-text">{meeting.closingPrayer}</p>
        </section>
      </div>

      <div className="mt-10 text-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Print Meeting Program
        </button>
      </div>
    </article>
  );
}
