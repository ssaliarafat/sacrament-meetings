
"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      aria-label="Print meeting program"
    >
      Print Meeting Program
    </button>
  );
}
