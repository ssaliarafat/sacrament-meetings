"use client";

import { useActionState, useState } from "react";
import {
  createMeeting,
  updateMeeting,
} from "@/lib/actions";
import type {
  MeetingActionState,
  SacramentMeeting,
  SpeakerItem,
} from "@/lib/types";

const initialMeetingActionState: MeetingActionState = {
  success: false,
  message: "",
  errors: {},
};

interface MeetingFormProps {
  meeting?: SacramentMeeting;
}

function FieldError({
  id,
  messages,
}: {
  id: string;
  messages: string[] | undefined;
}) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-1 text-sm font-medium text-red-700"
      role="alert"
      aria-live="polite"
    >
      {messages.join(" ")}
    </p>
  );
}

export default function MeetingForm({ meeting }: MeetingFormProps) {
  const [announcements, setAnnouncements] = useState<string[]>(
    meeting?.announcements ?? [""],
  );
  const [wardBusiness, setWardBusiness] = useState<string[]>(
    meeting?.wardBusiness.map((item) => item.description) ?? [""],
  );
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(
    meeting?.speakers ?? [
      { name: "", topic: "", type: "speaker" },
    ],
  );

  const action = meeting
    ? updateMeeting.bind(null, meeting.id)
    : createMeeting;
  const [state, formAction, pending] = useActionState<
    MeetingActionState,
    FormData
  >(action, initialMeetingActionState);

  const errorFor = (field: string) => state.errors[field];
  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}

      <fieldset className="grid gap-5 rounded-2xl border border-slate-200 p-6 md:grid-cols-2">
        <legend className="px-2 text-lg font-bold text-slate-900">
          Meeting details
        </legend>

        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-slate-700">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={meeting?.date ?? ""}
            aria-invalid={Boolean(errorFor("date"))}
            aria-describedby={errorFor("date") ? "date-error" : undefined}
            className={inputClass}
          />
          <FieldError id="date-error" messages={errorFor("date")} />
        </div>

        <div>
          <label htmlFor="meetingType" className="block text-sm font-semibold text-slate-700">
            Meeting type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            required
            defaultValue={meeting?.meetingType ?? "regular"}
            aria-invalid={Boolean(errorFor("meetingType"))}
            aria-describedby={errorFor("meetingType") ? "meetingType-error" : undefined}
            className={inputClass}
          >
            <option value="regular">Regular</option>
            <option value="testimony">Testimony</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
            <option value="special">Special</option>
          </select>
          <FieldError id="meetingType-error" messages={errorFor("meetingType")} />
        </div>

        <div>
          <label htmlFor="presiding" className="block text-sm font-semibold text-slate-700">
            Presiding
          </label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            required
            defaultValue={meeting?.presiding ?? ""}
            aria-invalid={Boolean(errorFor("presiding"))}
            aria-describedby={errorFor("presiding") ? "presiding-error" : undefined}
            className={inputClass}
          />
          <FieldError id="presiding-error" messages={errorFor("presiding")} />
        </div>

        <div>
          <label htmlFor="conducting" className="block text-sm font-semibold text-slate-700">
            Conducting
          </label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            required
            defaultValue={meeting?.conducting ?? ""}
            aria-invalid={Boolean(errorFor("conducting"))}
            aria-describedby={errorFor("conducting") ? "conducting-error" : undefined}
            className={inputClass}
          />
          <FieldError id="conducting-error" messages={errorFor("conducting")} />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-bold text-slate-900">
          Announcements
        </legend>
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <div key={index} className="flex items-start gap-3">
              <label htmlFor={`announcement-${index}`} className="sr-only">
                Announcement {index + 1}
              </label>
              <input
                id={`announcement-${index}`}
                name="announcements"
                type="text"
                value={announcement}
                aria-invalid={Boolean(errorFor(`announcement-${index}`))}
                aria-describedby={
                  errorFor(`announcement-${index}`)
                    ? `announcement-${index}-error`
                    : undefined
                }
                onChange={(event) => {
                  const next = [...announcements];
                  next[index] = event.target.value;
                  setAnnouncements(next);
                }}
                className={`${inputClass} mt-0`}
              />
              <FieldError
                id={`announcement-${index}-error`}
                messages={errorFor(`announcement-${index}`)}
              />
              <button
                type="button"
                onClick={() => setAnnouncements(announcements.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Remove
                <span className="sr-only"> announcement {index + 1}</span>
              </button>
            </div>
          ))}
        </div>
        <FieldError id="announcements-error" messages={errorFor("announcements")} />
        <button
          type="button"
          onClick={() => setAnnouncements([...announcements, ""])}
          className="mt-4 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Add announcement
        </button>
      </fieldset>

      <fieldset className="grid gap-5 rounded-2xl border border-slate-200 p-6 md:grid-cols-3">
        <legend className="px-2 text-lg font-bold text-slate-900">Hymns and prayers</legend>
        {[
          {
            prefix: "opening",
            title: "Opening hymn",
            numberName: "openingHymnNumber",
            titleName: "openingHymnTitle",
            hymn: meeting?.openingHymn,
            prayerName: "openingPrayer",
            prayerTitle: "Opening prayer",
            prayerValue: meeting?.openingPrayer,
          },
          {
            prefix: "sacrament",
            title: "Sacrament hymn",
            numberName: "sacramentHymnNumber",
            titleName: "sacramentHymnTitle",
            hymn: meeting?.sacramentHymn,
            prayerName: "openingPrayer",
            prayerTitle: "",
            prayerValue: "",
          },
          {
            prefix: "closing",
            title: "Closing hymn",
            numberName: "closingHymnNumber",
            titleName: "closingHymnTitle",
            hymn: meeting?.closingHymn,
            prayerName: "openingPrayer",
            prayerTitle: "",
            prayerValue: "",
          },
        ].map((hymnField) => (
          <div key={hymnField.prefix} className="space-y-4">
            <h3 className="font-semibold text-slate-900">{hymnField.title}</h3>
            <div>
              <label htmlFor={hymnField.numberName} className="block text-sm font-medium text-slate-700">
                Hymn number
              </label>
              <input
                id={hymnField.numberName}
                name={hymnField.numberName}
                type="number"
                min="1"
                required
                defaultValue={hymnField.hymn?.number ?? ""}
                aria-invalid={Boolean(
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnNumber"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnNumber"
                      : "closingHymnNumber"),
                )}
                aria-describedby={
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnNumber"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnNumber"
                      : "closingHymnNumber")
                    ? `${hymnField.prefix}-hymn-number-error`
                    : undefined
                }
                className={inputClass}
              />
              <FieldError
                id={`${hymnField.prefix}-hymn-number-error`}
                messages={
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnNumber"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnNumber"
                      : "closingHymnNumber")
                }
              />
            </div>
            <div>
              <label htmlFor={hymnField.titleName} className="block text-sm font-medium text-slate-700">
                Hymn title
              </label>
              <input
                id={hymnField.titleName}
                name={hymnField.titleName}
                type="text"
                required
                defaultValue={hymnField.hymn?.title ?? ""}
                aria-invalid={Boolean(
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnTitle"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnTitle"
                      : "closingHymnTitle"),
                )}
                aria-describedby={
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnTitle"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnTitle"
                      : "closingHymnTitle")
                    ? `${hymnField.prefix}-hymn-title-error`
                    : undefined
                }
                className={inputClass}
              />
              <FieldError
                id={`${hymnField.prefix}-hymn-title-error`}
                messages={
                  errorFor(hymnField.prefix === "opening"
                    ? "openingHymnTitle"
                    : hymnField.prefix === "sacrament"
                      ? "sacramentHymnTitle"
                      : "closingHymnTitle")
                }
              />
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="grid gap-5 rounded-2xl border border-slate-200 p-6 md:grid-cols-2">
        <legend className="px-2 text-lg font-bold text-slate-900">Prayers</legend>
        {[
          { name: "openingPrayer", label: "Opening prayer", value: meeting?.openingPrayer },
          { name: "closingPrayer", label: "Closing prayer", value: meeting?.closingPrayer },
        ].map((prayer) => (
          <div key={prayer.name}>
            <label htmlFor={prayer.name} className="block text-sm font-semibold text-slate-700">
              {prayer.label}
            </label>
            <input
              id={prayer.name}
              name={prayer.name}
              type="text"
              required
              defaultValue={prayer.value ?? ""}
              aria-invalid={Boolean(errorFor(prayer.name))}
              aria-describedby={errorFor(prayer.name) ? `${prayer.name}-error` : undefined}
              className={inputClass}
            />
            <FieldError id={`${prayer.name}-error`} messages={errorFor(prayer.name)} />
          </div>
        ))}
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-bold text-slate-900">Ward business</legend>
        <div className="space-y-3">
          {wardBusiness.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <label htmlFor={`wardBusiness-${index}`} className="sr-only">
                Ward business {index + 1}
              </label>
              <input
                id={`wardBusiness-${index}`}
                name="wardBusiness"
                type="text"
                value={item}
                aria-invalid={Boolean(errorFor(`wardBusiness-${index}`))}
                aria-describedby={
                  errorFor(`wardBusiness-${index}`)
                    ? `wardBusiness-${index}-error`
                    : undefined
                }
                onChange={(event) => {
                  const next = [...wardBusiness];
                  next[index] = event.target.value;
                  setWardBusiness(next);
                }}
                className={`${inputClass} mt-0`}
              />
              <FieldError
                id={`wardBusiness-${index}-error`}
                messages={errorFor(`wardBusiness-${index}`)}
              />
              <button
                type="button"
                onClick={() => setWardBusiness(wardBusiness.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Remove
                <span className="sr-only"> ward business {index + 1}</span>
              </button>
            </div>
          ))}
        </div>
        <FieldError id="wardBusiness-error" messages={errorFor("wardBusiness")} />
        <button
          type="button"
          onClick={() => setWardBusiness([...wardBusiness, ""])}
          className="mt-4 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Add ward business
        </button>

        <div className="mt-5">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={meeting?.stakeBusiness ?? false}
            className="h-4 w-4 rounded border-slate-300 text-emerald-700"
          />
          <label htmlFor="stakeBusiness" className="ml-2 text-sm font-semibold text-slate-700">
            Stake business
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-6">
        <legend className="px-2 text-lg font-bold text-slate-900">
          Speakers and musical numbers
        </legend>
        <div className="space-y-5">
          {speakers.map((speaker, index) => (
            <div key={index} className="grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-3">
              <div>
                <label htmlFor={`speakerName-${index}`} className="block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  id={`speakerName-${index}`}
                  name="speakerName"
                  type="text"
                  required
                  value={speaker.name}
                  aria-invalid={Boolean(errorFor(`speakerName-${index}`))}
                  aria-describedby={
                    errorFor(`speakerName-${index}`)
                      ? `speakerName-${index}-error`
                      : undefined
                  }
                  onChange={(event) => {
                    const next = [...speakers];
                    next[index] = { ...next[index], name: event.target.value };
                    setSpeakers(next);
                  }}
                  className={inputClass}
                />
                <FieldError
                  id={`speakerName-${index}-error`}
                  messages={errorFor(`speakerName-${index}`)}
                />
              </div>
              <div>
                <label htmlFor={`speakerTopic-${index}`} className="block text-sm font-semibold text-slate-700">
                  Topic or selection
                </label>
                <input
                  id={`speakerTopic-${index}`}
                  name="speakerTopic"
                  type="text"
                  required
                  value={speaker.topic}
                  aria-invalid={Boolean(errorFor(`speakerTopic-${index}`))}
                  aria-describedby={
                    errorFor(`speakerTopic-${index}`)
                      ? `speakerTopic-${index}-error`
                      : undefined
                  }
                  onChange={(event) => {
                    const next = [...speakers];
                    next[index] = { ...next[index], topic: event.target.value };
                    setSpeakers(next);
                  }}
                  className={inputClass}
                />
                <FieldError
                  id={`speakerTopic-${index}-error`}
                  messages={errorFor(`speakerTopic-${index}`)}
                />
              </div>
              <div>
                <label htmlFor={`speakerType-${index}`} className="block text-sm font-semibold text-slate-700">
                  Type
                </label>
                <select
                  id={`speakerType-${index}`}
                  name="speakerType"
                  value={speaker.type}
                  aria-invalid={Boolean(errorFor(`speakerType-${index}`))}
                  aria-describedby={
                    errorFor(`speakerType-${index}`)
                      ? `speakerType-${index}-error`
                      : undefined
                  }
                  onChange={(event) => {
                    const next = [...speakers];
                    next[index] = {
                      ...next[index],
                      type: event.target.value === "musical-number" ? "musical-number" : "speaker",
                    };
                    setSpeakers(next);
                  }}
                  className={inputClass}
                >
                  <option value="speaker">Speaker</option>
                  <option value="musical-number">Musical number</option>
                </select>
                <FieldError
                  id={`speakerType-${index}-error`}
                  messages={errorFor(`speakerType-${index}`)}
                />
              </div>
              <button
                type="button"
                onClick={() => setSpeakers(speakers.filter((_, itemIndex) => itemIndex !== index))}
                className="justify-self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:col-span-3"
              >
                Remove
                <span className="sr-only"> speaker or musical number {index + 1}</span>
              </button>
            </div>
          ))}
        </div>
        <FieldError id="speakers-error" messages={errorFor("speakers")} />
        <button
          type="button"
          onClick={() => setSpeakers([...speakers, { name: "", topic: "", type: "speaker" }])}
          className="mt-4 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Add speaker or musical number
        </button>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : meeting ? "Update meeting" : "Create meeting"}
        </button>
      </div>
    </form>
  );
}
