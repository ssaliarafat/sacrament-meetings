import { Suspense } from "react";
import TodayDate from "@/components/TodayDate";
import NavLinks from "@/components/NavLinks";
import AuthControls from "@/components/AuthControls";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">
              Riverside Ward
            </h1>
            <p className="text-sm text-slate-500">
              <TodayDate />
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Suspense
              fallback={<nav aria-label="Main navigation" className="h-10" />}
            >
              <NavLinks />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-24" />}>
              <AuthControls />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}