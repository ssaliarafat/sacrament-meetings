import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import { getMeetingsPage, isDatabaseConfigured } from "@/lib/meetings-db";

interface MeetingsPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const pageValue = Number.parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
  const result = isDatabaseConfigured()
    ? await getMeetingsPage({
        query,
        page: currentPage,
        limit: 5,
      })
    : { meetings: [], totalCount: 0, totalPages: 0, currentPage, hasPreviousPage: false, hasNextPage: false };

  const createPageHref = (page: number) => {
    const nextParams = new URLSearchParams();

    if (query) {
      nextParams.set("query", query);
    }

    nextParams.set("page", String(page));

    const queryString = nextParams.toString();
    return queryString ? `/meetings?${queryString}` : "/meetings";
  };

  return (
    <section>
      <div className="mb-7">
        <h2 className="text-3xl font-bold text-slate-900">All Meetings</h2>
        <p className="mt-2 text-slate-600">
          Browse current and past meeting programs.
        </p>
      </div>

      <MeetingSearch />

      {result.meetings.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>

          {result.totalPages > 0 && (
            <nav
              aria-label="Meeting pagination"
              className="mt-8 flex flex-wrap items-center justify-between gap-3"
            >
              <Link
                href={createPageHref(result.currentPage - 1)}
                aria-disabled={!result.hasPreviousPage}
                tabIndex={result.hasPreviousPage ? 0 : -1}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  result.hasPreviousPage
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 text-slate-400"
                }`}
              >
                Previous
              </Link>

              <p className="text-sm text-slate-600">
                Page {result.currentPage} of {result.totalPages}
              </p>

              <Link
                href={createPageHref(result.currentPage + 1)}
                aria-disabled={!result.hasNextPage}
                tabIndex={result.hasNextPage ? 0 : -1}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  result.hasNextPage
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "pointer-events-none cursor-not-allowed border-slate-200 text-slate-400"
                }`}
              >
                Next
              </Link>
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-800">No matching meetings found.</p>
          <p className="mt-2">
            Try a different search term or browse all meeting programs.
          </p>
        </div>
      )}
    </section>
  );
}
