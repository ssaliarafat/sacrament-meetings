"use client";

import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function MeetingSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("query") ?? "");

  const updateSearch = useDebouncedCallback((nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim()) {
      params.set("query", nextQuery.trim());
    } else {
      params.delete("query");
    }

    params.delete("page");

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, 300);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch.flush();
    const trimmedQuery = query.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    } else {
      params.delete("query");
    }

    params.delete("page");

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <label htmlFor="meeting-search" className="mb-2 block text-sm font-semibold text-slate-700">
        Search meetings
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="meeting-search"
          type="search"
          name="query"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            updateSearch(nextQuery);
          }}
          placeholder="Search by speaker, presiding, conducting, or meeting type"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Search
        </button>
      </div>
    </form>
  );
}
