
import { getMeetings, getMeetingsByDate } from "@/lib/meetings-db";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  const meetings = date
    ? getMeetingsByDate(date)
    : getMeetings();

  return Response.json(meetings);
}
