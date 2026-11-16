
import { getMeetings, getMeetingsByDate } from "@/lib/meetings-db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");
    const meetings = date ? await getMeetingsByDate(date) : await getMeetings();

    return Response.json(meetings, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load meetings.";

    return Response.json({ error: message }, { status: 500 });
  }
}
