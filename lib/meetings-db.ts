
import { neon } from "@neondatabase/serverless";
import type {
  MeetingsPageResult,
  SacramentMeeting,
  MeetingType,
} from "./types";

const DATABASE_URL = process.env.DATABASE_URL ?? null;
const sqlClient = DATABASE_URL ? neon(DATABASE_URL) : null;

export function isDatabaseConfigured(): boolean {
  return Boolean(DATABASE_URL);
}

function getSqlClient() {
  if (!sqlClient) {
    throw new Error(
      "Missing DATABASE_URL. Add the Neon PostgreSQL connection string to your environment before using the meetings database.",
    );
  }

  return sqlClient;
}

interface DatabaseMeetingRow {
  id: number;
  date: string | Date;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Record<string, string | number> | string;
  opening_prayer: string;
  ward_business: Array<Record<string, string>> | null;
  stake_business: boolean;
  sacrament_hymn: Record<string, string | number> | string;
  speakers: Array<Record<string, string>> | null;
  closing_hymn: Record<string, string | number> | string;
  closing_prayer: string;
}

const seedMeetings: Array<Omit<SacramentMeeting, "id">> = [
  {
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
    wardBusiness: [{ description: "Sustaining of new ward callings." }],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
    speakers: [
      {
        name: "Sister Mary Johnson",
        topic: "The importance of faith",
        type: "speaker",
      },
      {
        name: "Brother Elias Moore",
        topic: "I Know That My Redeemer Lives",
        type: "musical-number",
      },
    ],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother Peter Williams",
  },
  {
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
  {
    date: "2026-10-04",
    meetingType: "special",
    presiding: "Bishop John Smith",
    conducting: "Sister Rachel Adams",
    announcements: [
      "Thanksgiving meal donations are due by Wednesday.",
      "Please bring a friend to the upcoming ward social.",
    ],
    openingHymn: { number: 31, title: "O God, the Eternal Father" },
    openingPrayer: "Sister Naomi Scott",
    wardBusiness: [{ description: "Service assignment updates." }],
    stakeBusiness: false,
    sacramentHymn: { number: 197, title: "I Believe in Christ" },
    speakers: [
      {
        name: "Brother Joseph Martin",
        topic: "The blessings of obedience",
        type: "speaker",
      },
      {
        name: "Ward Choir",
        topic: "Come, Thou Fount of Every Blessing",
        type: "musical-number",
      },
    ],
    closingHymn: { number: 160, title: "Be Still, My Soul" },
    closingPrayer: "Brother Reed Walker",
  },
  {
    date: "2026-09-27",
    meetingType: "regular",
    presiding: "Bishop John Smith",
    conducting: "Brother David Brown",
    announcements: ["Relief Society and Priesthood meeting schedules."],
    openingHymn: { number: 40, title: "I Know that My Redeemer Lives" },
    openingPrayer: "Sister Hannah Price",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 136, title: "When I Survey the Wondrous Cross" },
    speakers: [
      {
        name: "Brother Lucas Reed",
        topic: "Living with covenant faith",
        type: "speaker",
      },
    ],
    closingHymn: { number: 140, title: "Did You Think to Pray?" },
    closingPrayer: "Brother Kevin Allen",
  },
  {
    date: "2026-09-20",
    meetingType: "testimony",
    presiding: "Bishop John Smith",
    conducting: "Brother Daniel White",
    announcements: ["Temple recommend interviews are this week."],
    openingHymn: { number: 9, title: "Joseph Smith's First Prayer" },
    openingPrayer: "Sister Lydia Wright",
    wardBusiness: [{ description: "Ward clean-up day announced." }],
    stakeBusiness: false,
    sacramentHymn: { number: 178, title: "There Is a Green Hill Far Away" },
    speakers: [
      {
        name: "Sister Monica Davis",
        topic: "The power of spiritual resilience",
        type: "speaker",
      },
      {
        name: "Brother Oliver Hall",
        topic: "The gift of the Holy Ghost",
        type: "speaker",
      },
    ],
    closingHymn: { number: 104, title: "God Be with You Till We Meet Again" },
    closingPrayer: "Sister Katie Perry",
  },
  {
    date: "2026-09-13",
    meetingType: "general",
    presiding: "President Emily Carter",
    conducting: "Brother David Brown",
    announcements: ["General Fast Sunday reminder."],
    openingHymn: { number: 62, title: "Our Savior's Love" },
    openingPrayer: "Brother Aaron Hughes",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 191, title: "I Stand All Amazed" },
    speakers: [
      {
        name: "President Emily Carter",
        topic: "Drawing closer to the Lord",
        type: "speaker",
      },
    ],
    closingHymn: { number: 120, title: "God Speed the Right" },
    closingPrayer: "Brother Isaac Ross",
  },
];

function parseJsonField<T>(value: T | string | null | undefined): T {
  if (value === null || value === undefined) {
    return [] as T;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  return value as T;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeMeeting(row: DatabaseMeetingRow): SacramentMeeting {
  const openingHymn = parseJsonField<Record<string, string | number>>(row.opening_hymn);
  const sacramentHymn = parseJsonField<Record<string, string | number>>(row.sacrament_hymn);
  const closingHymn = parseJsonField<Record<string, string | number>>(row.closing_hymn);
  const wardBusiness = parseJsonField<Array<Record<string, string>>>(row.ward_business ?? []);
  const speakers = parseJsonField<Array<Record<string, string>>>(row.speakers ?? []);

  return {
    id: Number(row.id),
    date: typeof row.date === "string" ? row.date.slice(0, 10) : formatDateKey(new Date(row.date)),
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: Array.isArray(row.announcements) ? row.announcements : [],
    openingHymn: {
      number: Number(openingHymn.number ?? 0),
      title: String(openingHymn.title ?? ""),
    },
    openingPrayer: row.opening_prayer,
    wardBusiness: wardBusiness.map((item) => ({
      description: String(item.description ?? ""),
    })),
    stakeBusiness: Boolean(row.stake_business),
    sacramentHymn: {
      number: Number(sacramentHymn.number ?? 0),
      title: String(sacramentHymn.title ?? ""),
    },
    speakers: speakers.map((item) => ({
      name: String(item.name ?? ""),
      topic: String(item.topic ?? ""),
      type: item.type === "musical-number" ? "musical-number" : "speaker",
    })),
    closingHymn: {
      number: Number(closingHymn.number ?? 0),
      title: String(closingHymn.title ?? ""),
    },
    closingPrayer: row.closing_prayer,
  };
}

let databaseInitPromise: Promise<void> | null = null;

export async function initializeDatabase(): Promise<void> {
  if (databaseInitPromise) {
    await databaseInitPromise;
    return;
  }

  databaseInitPromise = (async () => {
    const sql = getSqlClient();

    await sql`
      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        meeting_type VARCHAR(20) NOT NULL CHECK (
          meeting_type IN ('testimony', 'regular', 'stake', 'general', 'special')
        ),
        presiding VARCHAR(255) NOT NULL,
        conducting VARCHAR(255) NOT NULL,
        announcements TEXT[] DEFAULT '{}',
        opening_hymn JSONB NOT NULL,
        opening_prayer VARCHAR(255) NOT NULL,
        ward_business JSONB DEFAULT '[]',
        stake_business BOOLEAN DEFAULT false,
        sacrament_hymn JSONB NOT NULL,
        speakers JSONB DEFAULT '[]',
        closing_hymn JSONB NOT NULL,
        closing_prayer VARCHAR(255) NOT NULL
      );
    `;

    for (const meeting of seedMeetings) {
      await sql`
        INSERT INTO meetings (
          date,
          meeting_type,
          presiding,
          conducting,
          announcements,
          opening_hymn,
          opening_prayer,
          ward_business,
          stake_business,
          sacrament_hymn,
          speakers,
          closing_hymn,
          closing_prayer
        ) VALUES (
          ${meeting.date},
          ${meeting.meetingType},
          ${meeting.presiding},
          ${meeting.conducting},
          ${meeting.announcements},
          ${JSON.stringify(meeting.openingHymn)},
          ${meeting.openingPrayer},
          ${JSON.stringify(meeting.wardBusiness)},
          ${meeting.stakeBusiness},
          ${JSON.stringify(meeting.sacramentHymn)},
          ${JSON.stringify(meeting.speakers)},
          ${JSON.stringify(meeting.closingHymn)},
          ${meeting.closingPrayer}
        )
        ON CONFLICT (date) DO NOTHING;
      `;
    }
  })();

  await databaseInitPromise;
}

export async function getMeetings(): Promise<SacramentMeeting[]> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    SELECT *
    FROM meetings
    ORDER BY date DESC;
  `) as DatabaseMeetingRow[];

  return rows.map(normalizeMeeting);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | undefined> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    SELECT *
    FROM meetings
    WHERE id = ${id}
    LIMIT 1;
  `) as DatabaseMeetingRow[];

  return rows[0] ? normalizeMeeting(rows[0]) : undefined;
}

export async function getMeetingsByDate(
  date: string,
): Promise<SacramentMeeting[]> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    SELECT *
    FROM meetings
    WHERE date = ${date}
    ORDER BY date DESC;
  `) as DatabaseMeetingRow[];

  return rows.map(normalizeMeeting);
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  await initializeDatabase();

  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  sunday.setHours(0, 0, 0, 0);

  const rows = (await getSqlClient()`
    SELECT *
    FROM meetings
    WHERE date = ${formatDateKey(sunday)}
    LIMIT 1;
  `) as DatabaseMeetingRow[];

  return rows[0] ? normalizeMeeting(rows[0]) : undefined;
}

export async function getMeetingsPage({
  query = "",
  page = 1,
  limit = 5,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<MeetingsPageResult> {
  await initializeDatabase();

  const sanitizedQuery = query.trim();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 5;
  const offset = (safePage - 1) * safeLimit;

  if (!sanitizedQuery) {
    const totalResult = (await getSqlClient()`
      SELECT COUNT(*)::int AS total
      FROM meetings;
    `) as Array<{ total: string | number }>;
    const totalCount = Number(totalResult[0]?.total ?? 0);
    const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / safeLimit);
    const rows = (await getSqlClient()`
      SELECT *
      FROM meetings
      ORDER BY date DESC
      LIMIT ${safeLimit}
      OFFSET ${offset};
    `) as DatabaseMeetingRow[];

    const meetings = rows.map(normalizeMeeting);
    const currentPage = totalPages === 0 ? 1 : Math.min(safePage, totalPages);

    return {
      meetings,
      totalCount,
      totalPages,
      currentPage,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }

  const searchPattern = `%${sanitizedQuery}%`;

  const countResult = (await getSqlClient()`
    SELECT COUNT(*)::int AS total
    FROM meetings
    WHERE (
      presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR meeting_type ILIKE ${searchPattern}
      OR speakers::text ILIKE ${searchPattern}
    );
  `) as Array<{ total: string | number }>;

  const totalCount = Number(countResult[0]?.total ?? 0);
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / safeLimit);
  const currentPage = totalPages === 0 ? 1 : Math.min(safePage, totalPages);

  const rows = (await getSqlClient()`
    SELECT *
    FROM meetings
    WHERE (
      presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR meeting_type ILIKE ${searchPattern}
      OR speakers::text ILIKE ${searchPattern}
    )
    ORDER BY date DESC
    LIMIT ${safeLimit}
    OFFSET ${(currentPage - 1) * safeLimit};
  `) as DatabaseMeetingRow[];

  return {
    meetings: rows.map(normalizeMeeting),
    totalCount,
    totalPages,
    currentPage,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

export async function createMeetingInDatabase(
  meeting: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    ) VALUES (
      ${meeting.date},
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ${meeting.announcements},
      ${JSON.stringify(meeting.openingHymn)},
      ${meeting.openingPrayer},
      ${JSON.stringify(meeting.wardBusiness)},
      ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)},
      ${JSON.stringify(meeting.speakers)},
      ${JSON.stringify(meeting.closingHymn)},
      ${meeting.closingPrayer}
    )
    RETURNING *;
  `) as DatabaseMeetingRow[];

  if (!rows[0]) {
    throw new Error("The meeting could not be created.");
  }

  return normalizeMeeting(rows[0]);
}

export async function updateMeetingInDatabase(
  id: number,
  meeting: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting | undefined> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    UPDATE meetings
    SET
      date = ${meeting.date},
      meeting_type = ${meeting.meetingType},
      presiding = ${meeting.presiding},
      conducting = ${meeting.conducting},
      announcements = ${meeting.announcements},
      opening_hymn = ${JSON.stringify(meeting.openingHymn)},
      opening_prayer = ${meeting.openingPrayer},
      ward_business = ${JSON.stringify(meeting.wardBusiness)},
      stake_business = ${meeting.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(meeting.sacramentHymn)},
      speakers = ${JSON.stringify(meeting.speakers)},
      closing_hymn = ${JSON.stringify(meeting.closingHymn)},
      closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING *;
  `) as DatabaseMeetingRow[];

  return rows[0] ? normalizeMeeting(rows[0]) : undefined;
}

export async function deleteMeetingFromDatabase(
  id: number,
): Promise<boolean> {
  await initializeDatabase();

  const rows = (await getSqlClient()`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id;
  `) as Array<{ id: number }>;

  return Boolean(rows[0]);
}
