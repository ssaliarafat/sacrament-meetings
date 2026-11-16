
import { getMeetingById } from "@/lib/meetings-db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const meetingId = Number.parseInt(id, 10);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
      return Response.json(
        { error: "Meeting ID must be a valid positive number." },
        { status: 400 },
      );
    }

    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      return Response.json(
        { error: "Meeting not found." },
        { status: 404 },
      );
    }

    return Response.json(meeting, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load the meeting.";

    return Response.json({ error: message }, { status: 500 });
  }
}
