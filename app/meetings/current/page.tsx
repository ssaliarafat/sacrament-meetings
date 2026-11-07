import { connection } from "next/server";
import { redirect } from "next/navigation";
import {
  getCurrentMeeting,
  getMeetings,
} from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {
  await connection();

  const meeting = getCurrentMeeting() ?? getMeetings()[0];

  if (!meeting) {
    return <p>No meeting is currently available.</p>;
  }

  redirect(`/meetings/${meeting.id}`);
}

