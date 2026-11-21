"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createMeetingInDatabase,
  deleteMeetingFromDatabase,
  getMeetingById,
  updateMeetingInDatabase,
} from "./meetings-db";
import type {
  MeetingActionState,
  MeetingType,
  SacramentMeeting,
  WardBusinessItem,
} from "./types";

const meetingTypes = [
  "testimony",
  "regular",
  "stake",
  "general",
  "special",
] as const;

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const hymnSchema = z.object({
  number: z.coerce
    .number()
    .int("Hymn number must be a whole number.")
    .positive("Hymn number must be greater than zero."),
  title: requiredText("Hymn title"),
});

const meetingSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Enter a valid date."),
  meetingType: z.enum(meetingTypes, {
    message: "Select a valid meeting type.",
  }),
  presiding: requiredText("Presiding"),
  conducting: requiredText("Conducting"),
  announcements: z
    .array(z.string().trim().min(1, "Announcement text is required."))
    .default([]),
  openingHymn: hymnSchema,
  openingPrayer: requiredText("Opening prayer"),
  wardBusiness: z
    .array(z.object({ description: requiredText("Ward business description") }))
    .default([]),
  stakeBusiness: z.boolean(),
  sacramentHymn: hymnSchema,
  speakers: z
    .array(
      z.object({
        name: requiredText("Speaker or musical number name"),
        topic: requiredText("Speaker topic or musical selection"),
        type: z.enum(["speaker", "musical-number"]),
      }),
    )
    .default([]),
  closingHymn: hymnSchema,
  closingPrayer: requiredText("Closing prayer"),
});

function getText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getRepeatedText(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());
}

function getRepeatedRawText(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());
}

function parseMeetingFormData(formData: FormData) {
  const speakerNames = formData
    .getAll("speakerName")
    .filter((value): value is string => typeof value === "string");
  const speakerTopics = formData
    .getAll("speakerTopic")
    .filter((value): value is string => typeof value === "string");
  const speakerTypes = formData
    .getAll("speakerType")
    .filter((value): value is string => typeof value === "string");

  const speakers: Array<{
    name: string;
    topic: string;
    type: "speaker" | "musical-number";
  }> = speakerNames.map((name, index) => ({
    name: name.trim(),
    topic: (speakerTopics[index] ?? "").trim(),
    type: speakerTypes[index] === "musical-number" ? "musical-number" : "speaker",
  }));

  const wardBusiness: WardBusinessItem[] = getRepeatedRawText(
    formData,
    "wardBusiness",
  ).map((description) => ({ description }));

  const rawMeeting = {
    date: getText(formData, "date"),
    meetingType: getText(formData, "meetingType") as MeetingType,
    presiding: getText(formData, "presiding"),
    conducting: getText(formData, "conducting"),
    announcements: getRepeatedText(formData, "announcements"),
    openingHymn: {
      number: getText(formData, "openingHymnNumber"),
      title: getText(formData, "openingHymnTitle"),
    },
    openingPrayer: getText(formData, "openingPrayer"),
    wardBusiness,
    stakeBusiness: formData.get("stakeBusiness") === "on",
    sacramentHymn: {
      number: getText(formData, "sacramentHymnNumber"),
      title: getText(formData, "sacramentHymnTitle"),
    },
    speakers,
    closingHymn: {
      number: getText(formData, "closingHymnNumber"),
      title: getText(formData, "closingHymnTitle"),
    },
    closingPrayer: getText(formData, "closingPrayer"),
  };

  return meetingSchema.safeParse(rawMeeting);
}

function getValidationErrors(
  issues: z.ZodIssue[],
): Partial<Record<string, string[]>> {
  const errors: Partial<Record<string, string[]>> = {};

  const addError = (key: string, message: string) => {
    errors[key] = [...(errors[key] ?? []), message];
  };

  for (const issue of issues) {
    const [section, index, field] = issue.path;

    if (section === "announcements" && typeof index === "number") {
      addError(`announcement-${index}`, issue.message);
    } else if (section === "wardBusiness" && typeof index === "number") {
      addError(`wardBusiness-${index}`, issue.message);
    } else if (section === "speakers" && typeof index === "number") {
      if (field === "name") {
        addError(`speakerName-${index}`, issue.message);
      } else if (field === "topic") {
        addError(`speakerTopic-${index}`, issue.message);
      } else if (field === "type") {
        addError(`speakerType-${index}`, issue.message);
      } else {
        addError("speakers", issue.message);
      }
    } else if (section === "openingHymn") {
      addError(
        field === "number" ? "openingHymnNumber" : "openingHymnTitle",
        issue.message,
      );
    } else if (section === "sacramentHymn") {
      addError(
        field === "number" ? "sacramentHymnNumber" : "sacramentHymnTitle",
        issue.message,
      );
    } else if (section === "closingHymn") {
      addError(
        field === "number" ? "closingHymnNumber" : "closingHymnTitle",
        issue.message,
      );
    } else if (typeof section === "string") {
      addError(section, issue.message);
    }
  }

  return errors;
}

function databaseErrorState(error: unknown): MeetingActionState {
  console.error("Meeting database operation failed:", error);

  if (typeof error === "object" && error !== null) {
    const databaseError = error as { code?: string; message?: string };

    if (databaseError.code === "23505") {
      return {
        success: false,
        message: "A meeting already exists for this date.",
        errors: { date: ["Choose a date without an existing meeting."] },
      };
    }
  }

  return {
    success: false,
    message: "Unable to save the meeting. Please try again.",
    errors: {},
  };
}

function revalidateMeetingPages(id?: number): void {
  revalidatePath("/");
  revalidatePath("/meetings");
  revalidatePath("/meetings/current");
  revalidatePath("/meetings/[id]", "page");

  if (id !== undefined) {
    revalidatePath(`/meetings/${id}`);
  }
}

export async function createMeeting(
  _previousState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  const result = parseMeetingFormData(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: getValidationErrors(result.error.issues),
    };
  }

  let created: SacramentMeeting;

  try {
    const meeting = result.data as Omit<SacramentMeeting, "id">;
    created = await createMeetingInDatabase(meeting);
  } catch (error) {
    return databaseErrorState(error);
  }

  revalidateMeetingPages(created.id);
  redirect(`/meetings/${created.id}`);
}

export async function updateMeeting(
  id: number,
  _previousState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      success: false,
      message: "Meeting ID is invalid.",
      errors: {},
    };
  }

  const existing = await getMeetingById(id);

  if (!existing) {
    return {
      success: false,
      message: "This meeting no longer exists.",
      errors: {},
    };
  }

  const result = parseMeetingFormData(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: getValidationErrors(result.error.issues),
    };
  }

  let updated: SacramentMeeting | undefined;

  try {
    const meeting = result.data as Omit<SacramentMeeting, "id">;
    updated = await updateMeetingInDatabase(id, meeting);
  } catch (error) {
    return databaseErrorState(error);
  }

  if (!updated) {
    return {
      success: false,
      message: "This meeting no longer exists.",
      errors: {},
    };
  }

  revalidateMeetingPages(updated.id);
  redirect(`/meetings/${updated.id}`);
}

export async function deleteMeeting(
  id: number,
  formData: FormData,
): Promise<void> {
  void formData;

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Meeting ID is invalid.");
  }

  let deleted: boolean;

  try {
    deleted = await deleteMeetingFromDatabase(id);
  } catch (error) {
    console.error("Meeting delete operation failed:", error);
    throw new Error("Unable to delete the meeting. Please try again.");
  }

  if (!deleted) {
    throw new Error("Meeting not found.");
  }

  revalidateMeetingPages();
  redirect("/meetings");
}
