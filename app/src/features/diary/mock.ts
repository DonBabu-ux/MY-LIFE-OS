/**
 * Mock data for Diary feature (Batch 7)
 */

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  level: MoodLevel;
  label: string;
  emoji: string;
  color: string;
}

export interface DiaryMedia {
  id: string;
  type: "image" | "video" | "voice";
  uri: string;
  /** thumbnail placeholder color */
  thumbColor: string;
  durationSec?: number; // for video/voice
  caption?: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title?: string;
  body: string;
  mood: MoodLevel;
  media: DiaryMedia[];
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Mood palette
// ---------------------------------------------------------------------------
export const MOODS: MoodOption[] = [
  { level: 1, label: "Awful",    emoji: "😞", color: "#EF5350" },
  { level: 2, label: "Bad",      emoji: "😕", color: "#FF8A65" },
  { level: 3, label: "Okay",     emoji: "😐", color: "#FFA726" },
  { level: 4, label: "Good",     emoji: "😊", color: "#66BB6A" },
  { level: 5, label: "Amazing",  emoji: "😄", color: "#42A5F5" },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const daysAgo = (n: number, hour = 20, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const dateStr = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

// ---------------------------------------------------------------------------
// Mock Entries
// ---------------------------------------------------------------------------
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "de-1",
    date: dateStr(0),
    title: "A Focused Day",
    body: "Crushed three deep-work sessions today. Finally finished the design system refactor that's been hanging over me for two weeks. Celebrated with a great espresso at Java House.\n\nFeeling really aligned with the direction of the project. The new component architecture is clean and I'm proud of it.",
    mood: 5,
    media: [
      { id: "dm-1", type: "image", uri: "", thumbColor: "#4F8EF7", caption: "Coffee ☕" },
    ],
    tags: ["work", "productivity"],
    isPrivate: false,
    createdAt: daysAgo(0, 21, 30),
    updatedAt: daysAgo(0, 21, 45),
  },
  {
    id: "de-2",
    date: dateStr(1),
    title: "Morning Run & Reflection",
    body: "5am alarm. Debated staying in bed but dragged myself out. Did 8km along Ngong Road — the city is magical before sunrise.\n\nThinking about the next 6 months. Financially ahead of target, which feels good. Want to invest more intentionally.",
    mood: 4,
    media: [
      { id: "dm-2", type: "image", uri: "", thumbColor: "#66BB6A", caption: "Sunrise" },
      { id: "dm-3", type: "voice", uri: "", thumbColor: "#AB47BC", durationSec: 43, caption: "Voice memo" },
    ],
    tags: ["fitness", "reflection"],
    isPrivate: false,
    createdAt: daysAgo(1, 7, 15),
    updatedAt: daysAgo(1, 7, 20),
  },
  {
    id: "de-3",
    date: dateStr(2),
    title: "",
    body: "Had a rough meeting this afternoon. Stakeholder feedback was harsher than expected. Took a walk after to clear my head.\n\nReminder to self: criticism of the work is not criticism of me. Reset, iterate, move forward.",
    mood: 2,
    media: [],
    tags: ["work", "mindset"],
    isPrivate: false,
    createdAt: daysAgo(2, 17, 0),
    updatedAt: daysAgo(2, 17, 5),
  },
  {
    id: "de-4",
    date: dateStr(3),
    title: "Family Dinner",
    body: "Mom made nyama choma and pilau. The whole family came — first time in months we've all been at the table together. Little sister showed us her school project. So proud of her.\n\nThese moments are everything.",
    mood: 5,
    media: [
      { id: "dm-4", type: "image", uri: "", thumbColor: "#FF7043", caption: "Dinner 🍖" },
      { id: "dm-5", type: "image", uri: "", thumbColor: "#FFA726", caption: "Family" },
    ],
    tags: ["family", "gratitude"],
    isPrivate: false,
    createdAt: daysAgo(3, 22, 0),
    updatedAt: daysAgo(3, 22, 10),
  },
  {
    id: "de-5",
    date: dateStr(4),
    title: "Tough workout",
    body: "Leg day. Hit a new squat PR — 105kg. Body is feeling strong but I need to sleep more. Averaging 5.5 hours and it's showing in recovery time.\n\nAlso: started reading 'Can't Hurt Me' by David Goggins. Intense.",
    mood: 4,
    media: [],
    tags: ["fitness", "reading"],
    isPrivate: false,
    createdAt: daysAgo(4, 18, 30),
    updatedAt: daysAgo(4, 18, 35),
  },
  {
    id: "de-6",
    date: dateStr(5),
    title: "",
    body: "Stayed home all day. Didn't accomplish much. Some days are just maintenance days and that's okay. Watched a documentary about ocean ecosystems. My mind needed the rest.",
    mood: 3,
    media: [],
    tags: ["rest"],
    isPrivate: false,
    createdAt: daysAgo(5, 23, 0),
    updatedAt: daysAgo(5, 23, 0),
  },
  {
    id: "de-7",
    date: dateStr(7),
    title: "Investment Review",
    body: "Reviewed my portfolio with Samuel. NSE has been sluggish but the T-bill allocation is holding steady at 15.8% annualized. Rebalancing next month.\n\nGoal: get passive income to cover 30% of expenses by mid-2027.",
    mood: 4,
    media: [],
    tags: ["finance", "goals"],
    isPrivate: true,
    createdAt: daysAgo(7, 14, 0),
    updatedAt: daysAgo(7, 14, 30),
  },
  {
    id: "de-8",
    date: dateStr(9),
    title: "A Hard Conversation",
    body: "Had to have a difficult conversation with a colleague about performance expectations. I was honest but kind. It went better than feared.\n\nLeadership is uncomfortable sometimes. That's the job.",
    mood: 3,
    media: [],
    tags: ["work", "leadership"],
    isPrivate: true,
    createdAt: daysAgo(9, 20, 0),
    updatedAt: daysAgo(9, 20, 0),
  },
  {
    id: "de-9",
    date: dateStr(11),
    title: "Weekend Hike",
    body: "Hiked Mt. Longonot with five friends. 7 hours total including the crater loop. My legs gave up around hour 5 but the view from the rim was absolutely worth it.\n\nNature resets everything. Need to do this monthly.",
    mood: 5,
    media: [
      { id: "dm-6", type: "image", uri: "", thumbColor: "#26A69A", caption: "Summit!" },
      { id: "dm-7", type: "image", uri: "", thumbColor: "#66BB6A", caption: "Crater view" },
      { id: "dm-8", type: "video", uri: "", thumbColor: "#4F8EF7", durationSec: 24, caption: "360° view" },
    ],
    tags: ["adventure", "friends", "fitness"],
    isPrivate: false,
    createdAt: daysAgo(11, 20, 0),
    updatedAt: daysAgo(11, 20, 30),
  },
  {
    id: "de-10",
    date: dateStr(14),
    title: "",
    body: "Just a normal Tuesday. Nothing remarkable happened. Made ugali and sukuma wiki. Watched Netflix. Texted a few friends.\n\nOrdinary days are also worth recording.",
    mood: 3,
    media: [],
    tags: [],
    isPrivate: false,
    createdAt: daysAgo(14, 22, 0),
    updatedAt: daysAgo(14, 22, 0),
  },
  {
    id: "de-11",
    date: dateStr(18),
    title: "Launched the MVP",
    body: "We pushed to production at 11:47pm. Six months of work. The first real user signed up within an hour.\n\nCried a little. Not ashamed.\n\nThank you to the team. We built something real.",
    mood: 5,
    media: [
      { id: "dm-9", type: "image", uri: "", thumbColor: "#42A5F5", caption: "Launch night" },
    ],
    tags: ["work", "milestone", "gratitude"],
    isPrivate: false,
    createdAt: daysAgo(18, 23, 55),
    updatedAt: daysAgo(18, 23, 58),
  },
  {
    id: "de-12",
    date: dateStr(22),
    title: "Burnout Check-in",
    body: "Honestly? Running on fumes. Been at full sprint for 3 months. Signs: forgetting things, irritable, no excitement for work I usually love.\n\nDecision: next Saturday, full digital detox. No phone, no laptop, no slack.",
    mood: 2,
    media: [],
    tags: ["health", "mindset", "burnout"],
    isPrivate: true,
    createdAt: daysAgo(22, 21, 0),
    updatedAt: daysAgo(22, 21, 15),
  },
  {
    id: "de-13",
    date: dateStr(26),
    title: "Dad's Birthday",
    body: "Surprised Dad at the restaurant. His face when we walked in — priceless. He's 62 now, still sharp and full of energy.\n\nHe told me he's proud of what I've built. I didn't expect that to hit as hard as it did.",
    mood: 5,
    media: [
      { id: "dm-10", type: "image", uri: "", thumbColor: "#EC407A", caption: "Dad's cake 🎂" },
    ],
    tags: ["family", "gratitude"],
    isPrivate: false,
    createdAt: daysAgo(26, 21, 30),
    updatedAt: daysAgo(26, 21, 35),
  },
  {
    id: "de-14",
    date: dateStr(30),
    title: "New Month Goals",
    body: "## October Intentions\n\n1. Publish 2 blog posts\n2. Hit 30 workout sessions\n3. Read 2 books\n4. Save KES 80,000\n5. Call family every Sunday\n6. Sleep 7+ hours nightly\n\nLet's go.",
    mood: 4,
    media: [],
    tags: ["goals", "planning"],
    isPrivate: false,
    createdAt: daysAgo(30, 9, 0),
    updatedAt: daysAgo(30, 9, 5),
  },
  {
    id: "de-15",
    date: dateStr(35),
    title: "",
    body: "Sick day. Fever and sore throat. Stayed in bed, drank lots of tea and warm water. Netflix and rest.\n\nThe body is asking for a break. Listening.",
    mood: 1,
    media: [],
    tags: ["health"],
    isPrivate: false,
    createdAt: daysAgo(35, 15, 0),
    updatedAt: daysAgo(35, 15, 0),
  },
  {
    id: "de-16",
    date: dateStr(42),
    title: "Visiting Naivasha",
    body: "Two-day trip to Naivasha with old university friends. Boat ride on the lake, watched hippos at sunset, ate tilapia by the water.\n\nThese friendships are a decade old now. They feel like home.",
    mood: 5,
    media: [
      { id: "dm-11", type: "image", uri: "", thumbColor: "#29B6F6", caption: "Lake Naivasha" },
      { id: "dm-12", type: "image", uri: "", thumbColor: "#66BB6A", caption: "Hippos!" },
    ],
    tags: ["travel", "friends"],
    isPrivate: false,
    createdAt: daysAgo(42, 22, 0),
    updatedAt: daysAgo(42, 22, 10),
  },
  {
    id: "de-17",
    date: dateStr(50),
    title: "Quarterly Retrospective",
    body: "## What Went Well\n- Exceeded financial savings target\n- 28 workouts this quarter\n- Launched product on schedule\n- Deepened 3 key friendships\n\n## What to Improve\n- Sleep consistency\n- Email response time\n- Weekly family calls\n\n## Big Win\nGrew consulting income by 40%.",
    mood: 4,
    media: [],
    tags: ["planning", "reflection", "goals"],
    isPrivate: false,
    createdAt: daysAgo(50, 10, 0),
    updatedAt: daysAgo(50, 10, 30),
  },
  {
    id: "de-18",
    date: dateStr(60),
    title: "Starting This Journal",
    body: "First entry. I've always meant to keep a diary and never stuck with it. This time feels different — I'm building the app myself, so the friction is gone.\n\nHere's to showing up consistently. Even when there's nothing profound to say.\n\nThis is day one.",
    mood: 4,
    media: [],
    tags: ["reflection", "milestone"],
    isPrivate: false,
    createdAt: daysAgo(60, 20, 0),
    updatedAt: daysAgo(60, 20, 0),
  },
];
