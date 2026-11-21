"use client";

import { deleteMeeting } from "@/lib/actions";

export default function DeleteMeetingButton({
  meetingId,
}: {
  meetingId: number;
}) {
  return (
    <form
      action={deleteMeeting.bind(null, meetingId)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this meeting? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50"
      >
        Delete meeting
      </button>
    </form>
  );
}
