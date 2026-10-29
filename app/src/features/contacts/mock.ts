/**
 * Mock data for Contacts feature (Batch 11)
 */

export interface ContactPhone {
  label: "mobile" | "work" | "home" | "other";
  number: string;
}

export interface ContactEmail {
  label: "personal" | "work" | "other";
  address: string;
}

export interface LinkedNote {
  id: string;
  title: string;
  date: string;
}

export interface LinkedDiaryEntry {
  id: string;
  title: string;
  date: string;
  mood: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  avatarColor: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  organization?: string;
  jobTitle?: string;
  labels: string[];
  starred: boolean;
  notes?: string;
  linkedNotes: LinkedNote[];
  linkedDiaryEntries: LinkedDiaryEntry[];
}

export interface DuplicatePair {
  id: string;
  contactA: Contact;
  contactB: Contact;
  matchReason: string;
  matchScore: number; // e.g. 92 for 92%
}

export const mockContacts: Contact[] = [
  {
    id: "contact_1",
    firstName: "Alex",
    lastName: "Johnson",
    avatarColor: "#6366F1",
    phones: [{ label: "mobile", number: "+1 (555) 234-5678" }],
    emails: [{ label: "work", address: "alex.j@acme.corp" }],
    organization: "Acme Corp",
    jobTitle: "Senior Product Designer",
    labels: ["Work", "VIP"],
    starred: true,
    notes: "Lead designer on the mobile redesign project. Prefers Slack over email.",
    linkedNotes: [
      { id: "note_101", title: "Q3 Design System Sync", date: "2026-09-18" },
      { id: "note_102", title: "Mobile OS Navigation Feedback", date: "2026-09-10" },
    ],
    linkedDiaryEntries: [
      { id: "diary_201", title: "Product sprint kick-off with Alex", date: "2026-09-12", mood: "great" },
    ],
  },
  {
    id: "contact_2",
    firstName: "Alexander",
    lastName: "Johnson",
    avatarColor: "#4F46E5",
    phones: [{ label: "mobile", number: "+1 (555) 234-5678" }, { label: "work", number: "+1 (555) 999-0011" }],
    emails: [{ label: "personal", address: "alexj@gmail.com" }],
    organization: "Acme Corp",
    jobTitle: "Product Designer",
    labels: ["Work"],
    starred: false,
    notes: "Old contact card imported from Google Contacts.",
    linkedNotes: [],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_3",
    firstName: "David",
    lastName: "Chen",
    avatarColor: "#10B981",
    phones: [{ label: "mobile", number: "+1 (555) 345-6789" }],
    emails: [{ label: "work", address: "david@lumina.ai" }],
    organization: "Lumina AI",
    jobTitle: "CTO & Co-founder",
    labels: ["VIP", "Client"],
    starred: true,
    notes: "Discussed angel investment & infrastructure architecture.",
    linkedNotes: [
      { id: "note_103", title: "Lumina AI Tech Architecture Review", date: "2026-09-14" },
    ],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_4",
    firstName: "Elena",
    lastName: "Rostova",
    avatarColor: "#EC4899",
    phones: [{ label: "mobile", number: "+1 (555) 456-7890" }],
    emails: [{ label: "personal", address: "elena.r@artspace.org" }],
    organization: "ArtSpace Studio",
    jobTitle: "Creative Director",
    labels: ["Friend"],
    starred: false,
    notes: "Met at the modern art exhibition. Great curator.",
    linkedNotes: [],
    linkedDiaryEntries: [
      { id: "diary_202", title: "Weekend gallery tour with Elena", date: "2026-09-08", mood: "good" },
    ],
  },
  {
    id: "contact_5",
    firstName: "Marcus",
    lastName: "Vance",
    avatarColor: "#F59E0B",
    phones: [{ label: "mobile", number: "+1 (555) 567-8901" }, { label: "home", number: "+1 (555) 567-8902" }],
    emails: [{ label: "personal", address: "marcus.v@family.net" }],
    organization: "Apex Capital",
    jobTitle: "Managing Partner",
    labels: ["Family", "VIP"],
    starred: true,
    notes: "Uncle Marcus. Birthday on November 14.",
    linkedNotes: [
      { id: "note_104", title: "Family Thanksgiving Planning", date: "2026-09-02" },
    ],
    linkedDiaryEntries: [
      { id: "diary_203", title: "Dinner with Marcus & family", date: "2026-09-15", mood: "great" },
    ],
  },
  {
    id: "contact_6",
    firstName: "Maya",
    lastName: "Lin",
    avatarColor: "#8B5CF6",
    phones: [{ label: "mobile", number: "+1 (555) 678-9012" }],
    emails: [{ label: "work", address: "maya@quantum.io" }],
    organization: "Quantum Labs",
    jobTitle: "Research Scientist",
    labels: ["Work"],
    starred: false,
    notes: "Specializes in state estimation & edge compute.",
    linkedNotes: [],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_7",
    firstName: "Sarah",
    lastName: "Miller",
    avatarColor: "#06B6D4",
    phones: [{ label: "mobile", number: "+1 (555) 789-0123" }],
    emails: [{ label: "personal", address: "sarah.miller@voyage.com" }],
    organization: "Voyage Travel",
    jobTitle: "Operations Lead",
    labels: ["Friend"],
    starred: true,
    notes: "Helped coordinate the upcoming Hokkaido trip.",
    linkedNotes: [
      { id: "note_105", title: "Japan Trip Lodging & Bullet Trains", date: "2026-09-20" },
    ],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_8",
    firstName: "Sarah",
    lastName: "M.",
    avatarColor: "#0284C7",
    phones: [{ label: "mobile", number: "+1 (555) 789-0999" }],
    emails: [{ label: "personal", address: "sarah.miller@voyage.com" }],
    organization: "Voyage",
    jobTitle: "Operations",
    labels: ["Friend"],
    starred: false,
    notes: "Duplicate card from WhatsApp contact sync.",
    linkedNotes: [],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_9",
    firstName: "Thomas",
    lastName: "Wright",
    avatarColor: "#14B8A6",
    phones: [{ label: "work", number: "+1 (555) 890-1234" }],
    emails: [{ label: "work", address: "t.wright@wrightlaw.com" }],
    organization: "Wright & Associates",
    jobTitle: "Senior Legal Counsel",
    labels: ["Work", "Client"],
    starred: false,
    notes: "IP attorney. Office hours Thursdays 2-5pm.",
    linkedNotes: [
      { id: "note_106", title: "Trademark & Entity Filing Checklist", date: "2026-08-25" },
    ],
    linkedDiaryEntries: [],
  },
  {
    id: "contact_10",
    firstName: "Zoe",
    lastName: "Kravitz",
    avatarColor: "#F43F5E",
    phones: [{ label: "mobile", number: "+1 (555) 901-2345" }],
    emails: [{ label: "personal", address: "zoe.k@soundtrack.fm" }],
    organization: "Echo Media",
    jobTitle: "Audio Producer",
    labels: ["Friend", "VIP"],
    starred: true,
    notes: "Collaborating on podcast episode 12 soundtrack.",
    linkedNotes: [],
    linkedDiaryEntries: [
      { id: "diary_204", title: "Studio recording session with Zoe", date: "2026-09-19", mood: "good" },
    ],
  },
];

export const mockDuplicatePairs: DuplicatePair[] = [
  {
    id: "dup_1",
    contactA: mockContacts[0], // Alex Johnson
    contactB: mockContacts[1], // Alexander Johnson
    matchReason: "Matching mobile phone (+1 555-234-5678) and same organization (Acme Corp)",
    matchScore: 94,
  },
  {
    id: "dup_2",
    contactA: mockContacts[6], // Sarah Miller
    contactB: mockContacts[7], // Sarah M.
    matchReason: "Identical email address (sarah.miller@voyage.com) and similar first name",
    matchScore: 91,
  },
];

export const ALL_CONTACT_LABELS = ["All", "VIP", "Work", "Family", "Friend", "Client"];
