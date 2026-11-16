
export default function MeetingsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-white p-10 text-center shadow-sm"
    >
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
      <p className="mt-4 font-medium text-slate-600">
        Loading meeting programs...
      </p>
    </div>
  );
}
