import MeetingForm from "@/components/MeetingForm";

export default function NewMeetingPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Create Meeting</h1>
      <p className="mt-2 text-slate-600">
        Add a sacrament meeting program to Riverside Ward.
      </p>
      <div className="mt-8">
        <MeetingForm />
      </div>
    </section>
  );
}
