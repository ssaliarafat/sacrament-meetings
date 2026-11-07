
import Link from "next/link";

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Riverside Ward
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Meeting Programs
          </h1>
        </div>
        <Link
          href="/meetings"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          All meetings
        </Link>
      </div>
      {children}
    </div>
  );
}
