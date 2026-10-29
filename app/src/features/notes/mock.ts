/**
 * Mock data for Notes feature (Batch 6)
 */

export interface NoteTag {
  id: string;
  name: string;
  color: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  noteCount: number;
}

export interface NoteAttachment {
  id: string;
  type: "image" | "pdf" | "file";
  name: string;
  uri: string;
  sizeBytes: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  folderId: string | null;
  tagIds: string[];
  attachments: NoteAttachment[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------
export const mockTags: NoteTag[] = [
  { id: "tag-1", name: "Work", color: "#4F8EF7" },
  { id: "tag-2", name: "Personal", color: "#AB47BC" },
  { id: "tag-3", name: "Finance", color: "#66BB6A" },
  { id: "tag-4", name: "Ideas", color: "#FF7043" },
  { id: "tag-5", name: "Health", color: "#EC407A" },
  { id: "tag-6", name: "Learning", color: "#26A69A" },
];

// ---------------------------------------------------------------------------
// Folders
// ---------------------------------------------------------------------------
export const mockFolders: NoteFolder[] = [
  { id: "folder-all", name: "All Notes", icon: "documents-outline", color: "#78909C", noteCount: 12 },
  { id: "folder-1", name: "Work", icon: "briefcase-outline", color: "#4F8EF7", noteCount: 4 },
  { id: "folder-2", name: "Personal", icon: "person-outline", color: "#AB47BC", noteCount: 3 },
  { id: "folder-3", name: "Ideas", icon: "bulb-outline", color: "#FF7043", noteCount: 3 },
  { id: "folder-4", name: "Health", icon: "fitness-outline", color: "#EC407A", noteCount: 2 },
];

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------
export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "Q3 Strategy Meeting Notes",
    body: `## Key Decisions\n- Expand to East Africa by Q4\n- Hire 3 senior engineers\n- Budget approved: KES 4.2M\n\n## Action Items\n1. Draft job postings by Friday\n2. Set up recruiting pipeline\n3. Schedule stakeholder review\n\n## Next Meeting\nScheduled for Monday 10am.`,
    folderId: "folder-1",
    tagIds: ["tag-1"],
    attachments: [],
    isPinned: true,
    isFavorite: true,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "note-2",
    title: "App Ideas — MyLifeOS v2",
    body: `## Feature Ideas\n- Widget support for dashboard\n- SMS auto-parsing improvements\n- WhatsApp receipt capture\n- Offline AI categorization\n\n## Design Notes\nMaterial You inspired with custom tokens. Focus on speed — under 100ms for all interactions.`,
    folderId: "folder-3",
    tagIds: ["tag-4", "tag-1"],
    attachments: [],
    isPinned: true,
    isFavorite: false,
    createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "note-3",
    title: "Morning Routine Optimization",
    body: `## Current Routine (6:00 – 8:00am)\n- 6:00 Wake up & hydrate\n- 6:15 10 min meditation\n- 6:30 Exercise (30 min)\n- 7:00 Shower + prep\n- 7:30 Breakfast & journaling\n- 8:00 Start deep work\n\n## What's Working\nThe exercise block before breakfast has significantly improved focus.`,
    folderId: "folder-2",
    tagIds: ["tag-2", "tag-5"],
    attachments: [],
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-4",
    title: "Investment Portfolio Review",
    body: `## Holdings\n- NSE ETF: 45%\n- T-Bills (91-day): 30%\n- SACCO savings: 15%\n- Cash buffer: 10%\n\n## Goals\nTarget 18% annual return. Rebalance quarterly.\n\n## Notes\nConsider increasing T-bill allocation next quarter given current rates.`,
    folderId: "folder-1",
    tagIds: ["tag-1", "tag-3"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-5",
    title: "Book Notes: Atomic Habits",
    body: `## Core Ideas\n1. 1% better every day = 37x better in a year\n2. Systems > Goals\n3. Identity-based habits\n4. The 4 laws of behavior change\n\n## Quotes\n> "You do not rise to the level of your goals. You fall to the level of your systems."\n\n## My Implementation\n- Habit stacking for morning routine\n- Environment design for reading`,
    folderId: "folder-3",
    tagIds: ["tag-6", "tag-2"],
    attachments: [],
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-6",
    title: "Workout Plan — October",
    body: `## Weekly Split\n- Mon: Push (chest, shoulders, triceps)\n- Tue: Pull (back, biceps)\n- Wed: Legs + core\n- Thu: Rest / light cardio\n- Fri: Push\n- Sat: Pull\n- Sun: Active recovery\n\n## Current PRs\n- Bench: 80kg\n- Squat: 100kg\n- Deadlift: 120kg`,
    folderId: "folder-4",
    tagIds: ["tag-5"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-7",
    title: "Project Proposal: Community App",
    body: `## Overview\nA neighborhood super-app connecting Nairobi residents.\n\n## Core Features\n- Local marketplace\n- Community announcements\n- Emergency contacts\n- Neighborhood watch reports\n\n## Tech Stack\n- React Native frontend\n- Node.js + PostgreSQL backend\n- Firebase for real-time\n\n## Timeline\nMVP in 3 months.`,
    folderId: "folder-1",
    tagIds: ["tag-1", "tag-4"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-8",
    title: "Nutrition Tracker Goals",
    body: `## Daily Targets\n- Calories: 2,400\n- Protein: 160g\n- Carbs: 280g\n- Fats: 70g\n- Water: 3L\n\n## Meal Prep Schedule\nSunday: 2 hours prep for the week\n\n## Supplements\n- Creatine 5g daily\n- Vitamin D 4000IU\n- Omega-3 2g`,
    folderId: "folder-4",
    tagIds: ["tag-5", "tag-2"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-9",
    title: "Side Hustle Ideas",
    body: `## Top 5 Picks\n1. UI/UX consulting (existing skills)\n2. Online course — React Native\n3. No-code app templates\n4. Financial coaching\n5. Photography on weekends\n\n## Evaluation Criteria\n- Time investment < 10hrs/week\n- Minimum KES 50K/month potential\n- Leverage existing network`,
    folderId: "folder-3",
    tagIds: ["tag-4", "tag-3"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-10",
    title: "Team Stand-up Template",
    body: `## Daily Stand-up Format\n**What I did yesterday:**\n- \n\n**What I'm doing today:**\n- \n\n**Blockers:**\n- None\n\n---\n*Keep it under 2 minutes per person.*`,
    folderId: "folder-1",
    tagIds: ["tag-1"],
    attachments: [],
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-11",
    title: "Financial Goals 2026",
    body: `## Net Worth Target\nKES 5,000,000 by December 2026\n\n## Income\n- Employment: KES 180K/month\n- Consulting: KES 50K+/month\n- Passive: KES 15K/month\n\n## Savings Rate\nTarget: 40% of gross income\n\n## Milestones\n- [ ] Emergency fund: 6 months (KES 1.08M)\n- [ ] Invest KES 100K/month\n- [ ] Pay off car loan by June`,
    folderId: "folder-2",
    tagIds: ["tag-3", "tag-2"],
    attachments: [],
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 45 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 86400 * 1000).toISOString(),
  },
  {
    id: "note-12",
    title: "Things I'm Grateful For",
    body: `1. Good health and energy\n2. A supportive family\n3. Meaningful work I enjoy\n4. Financial stability and growth\n5. Strong friendships\n6. Living in Nairobi — vibrant and full of opportunity\n7. Access to technology and learning\n\n*Updated regularly.*`,
    folderId: "folder-2",
    tagIds: ["tag-2"],
    attachments: [],
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 60 * 86400 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
  },
];
