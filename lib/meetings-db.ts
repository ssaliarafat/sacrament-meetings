
import type { SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-11-08",
    meetingType: "testimony",
    presiding: "Bishop John Smith",
    conducting: "Brother David Brown",
    announcements: [
      "Ward youth activity on Saturday.",
      "Please remember the upcoming service project.",
    ],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Brother Michael Johnson",
    wardBusiness: [
      { description: "Sustaining of new ward callings." },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
    speakers: [
      {
        name: "Sister Mary Johnson",
        topic: "The importance of faith",
        type: "speaker",
      },
    ],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Peter Williams",
  },
  {
    id: 2,
    date: "2026-11-01",
    meetingType: "regular",
    presiding: "Bishop John Smith",
    conducting: "Brother David Brown",
    announcements: ["Sunday School begins after sacrament meeting."],
    openingHymn: { number: 3, title: "Now Let Us Rejoice" },
    openingPrayer: "Brother James Clark",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: "Reverently and Meekly Now" },
    speakers: [
      {
        name: "Brother Daniel White",
        topic: "Following the Savior",
        type: "speaker",
      },
      {
        name: "Sister Grace Lee",
        topic: "Finding peace through prayer",
        type: "speaker",
      },
    ],
    closingHymn: { number: 89, title: "The Lord Is My Shepherd" },
    closingPrayer: "Sister Anna Green",
  },
  {
    id: 3,
    date: "2026-10-25",
    meetingType: "regular",
    presiding: "Bishop John Smith",
    conducting: "Brother David Brown",
    announcements: ["Ward choir practice will be held on Wednesday."],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Brother Samuel King",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      {
        name: "Sister Elizabeth Moore",
        topic: "Gratitude in daily life",
        type: "speaker",
      },
    ],
    closingHymn: { number: 98, title: "I Need Thee Every Hour" },
    closingPrayer: "Brother Thomas Hill",
  },
  {
    id: 4,
    date: "2026-10-18",
    meetingType: "general",
    presiding: "Stake President Robert Green",
    conducting: "Brother David Brown",
    announcements: [],
    openingHymn: { number: 1, title: "The Morning Breaks" },
    openingPrayer: "Brother Andrew Scott",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 172, title: "In Humility, Our Savior" },
    speakers: [
      {
        name: "President Robert Green",
        topic: "Strengthening families",
        type: "speaker",
      },
    ],
    closingHymn: { number: 96, title: "Dearest Children, God Is Near You" },
    closingPrayer: "Brother Daniel White",
  },
  {
    id: 5,
    date: "2026-10-11",
    meetingType: "stake",
    presiding: "Stake President Robert Green",
    conducting: "Brother David Brown",
    announcements: ["Stake conference information."],
    openingHymn: { number: 6, title: "Redeemer of Israel" },
    openingPrayer: "Brother Peter Williams",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 174, title: "While of These Emblems We Partake" },
    speakers: [
      {
        name: "President Robert Green",
        topic: "Serving one another",
        type: "speaker",
      },
    ],
    closingHymn: { number: 97, title: "Lead, Kindly Light" },
    closingPrayer: "Brother James Clark",
  },
];

export function getMeetings(): SacramentMeeting[] {
  return meetings;
}

export function getMeetingById(
  id: number,
): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

export function getMeetingsByDate(
  date: string,
): SacramentMeeting[] {
  return meetings.filter((meeting) => meeting.date === date);
}

export function getCurrentMeeting(): SacramentMeeting | undefined {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const date = [
    sunday.getFullYear(),
    String(sunday.getMonth() + 1).padStart(2, "0"),
    String(sunday.getDate()).padStart(2, "0"),
  ].join("-");

  return meetings.find((meeting) => meeting.date === date);
}
