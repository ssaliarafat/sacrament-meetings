import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-3xl font-bold text-slate-900">
        Meeting not found
      </h1>
      <p className="mt-3 text-slate-600">
        The meeting you tried to edit does not exist or is no longer available.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-block rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        Back to all meetings
      </Link>
    </section>
  );
}
