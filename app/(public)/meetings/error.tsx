"use client";

import { useEffect } from "react";

export default function MeetingsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
    >
      <h1 className="text-2xl font-bold text-red-900">
        Unable to load meetings
      </h1>
      <p className="mt-2 text-red-700">
        The meeting information could not be loaded. Please try again.
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-5 rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
      >
        Try again
      </button>
    </section>
  );
}
