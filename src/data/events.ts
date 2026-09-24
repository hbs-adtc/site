import luma from './luma.json';

export interface ClubEvent {
  id: string;
  name: string;
  startAt: string;
  location: string | null;
  format: string;
  url?: string;
  cover?: string | null;
  guests?: number | null;
  speakers?: string;
}

interface LumaEvent {
  id: string;
  name: string;
  url: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location: string | null;
  cover: string | null;
  guests: number | null;
}

// Context Luma's API doesn't carry, keyed by Luma URL. Add a line here
// when a new event goes up so its card names the speakers.
const LUMA_NOTES: Record<string, { format: string; speakers?: string }> = {
  'https://luma.com/y8gbdeak': {
    format: 'Speaker series',
    speakers: 'Levi Gershon, CEO of CRABI Robotics · Brandon Farwell, GP at Xfund',
  },
  'https://luma.com/b80jmaks': {
    format: 'Speaker session',
    speakers: 'Anna Marie Wagner (HBS ’17), Co-Founder & CEO of Transfyr',
  },
  'https://luma.com/mk5us2e8': {
    format: 'Fireside',
    speakers: 'Daniel Theobald, Founder of Vecna Robotics and MassRobotics',
  },
  'https://luma.com/cyw25l8u': {
    format: 'Workshop',
    speakers: 'Alex Prather, Founder & CEO of Project SPINOUT',
  },
};

// Events that predate the Luma calendar or were never listed on it.
// Times are Eastern and approximate to the start of the event.
const ARCHIVE: ClubEvent[] = [
  { id: 'kickoff-25', name: 'Automation & Deep Tech Club Kick-Off', startAt: '2025-09-11T22:00:00Z', location: 'Aldrich 111', format: 'Club launch' },
  { id: 'argus-25', name: 'Fireside with Lisa Yan & Drew Borinstein, Argus Systems', startAt: '2025-09-17T20:00:00Z', location: 'Aldrich 009', format: 'Fireside' },
  { id: 'waabi-25', name: 'Waabi: The Business of Physical Automation', startAt: '2025-09-24T21:30:00Z', location: 'Aldrich 110', format: 'Fireside' },
  { id: 'grid-25', name: 'Tinkering on campus: SEAS and The Grid tour', startAt: '2025-09-25T21:00:00Z', location: 'SEAS · The Grid', format: 'Campus tour' },
  { id: 'mixer-oct-25', name: 'Harvard Tech Mixer: Innovation Exchange', startAt: '2025-10-01T20:30:00Z', location: 'SEC West Atrium', format: 'Mixer' },
  { id: 'formlabs-25', name: 'Fireside with Dávid Lakatos, Formlabs', startAt: '2025-10-20T21:00:00Z', location: 'Aldrich 107', format: 'Fireside' },
  { id: 'righthand-25', name: 'RightHand Robotics product and workflows showcase', startAt: '2025-11-05T20:00:00Z', location: 'RightHand Robotics HQ, Charlestown', format: 'Company visit' },
  { id: 'breakfast-25', name: 'HBS Robotics alumni breakfast', startAt: '2025-11-11T15:00:00Z', location: 'Batten 201', format: 'Alumni breakfast' },
  { id: 'mixer-nov-25', name: 'Fall mixer', startAt: '2025-11-13T23:30:00Z', location: 'Hamilton Hall Lounge', format: 'Club mixer' },
  { id: 'kass-25', name: 'Conversation with Zack Kass, former OpenAI executive', startAt: '2025-11-17T21:00:00Z', location: 'Aldrich 207', format: 'Conversation' },
  { id: 'rolodex-26', name: 'Rolodex Night', startAt: '2026-09-16T22:00:00Z', location: 'Aldrich 009', format: 'Members only' },
  {
    id: 'blue-origin-26',
    name: 'Blue Origin AMA & Networking, with the Aerospace & Defense Club',
    startAt: '2026-09-23T20:00:00Z',
    location: 'Hawes 202',
    format: 'Members only',
    cover: `${process.env.PUBLIC_URL}/events/blue-origin-ama.jpg`,
  },
];

const fromLuma: ClubEvent[] = (luma.events as LumaEvent[]).map(e => ({
  id: e.id,
  name: e.name,
  startAt: e.startAt,
  location: e.location,
  url: e.url,
  cover: e.cover,
  guests: e.guests,
  format: LUMA_NOTES[e.url]?.format ?? 'Event',
  speakers: LUMA_NOTES[e.url]?.speakers,
}));

const byStart = (a: ClubEvent, b: ClubEvent) => a.startAt.localeCompare(b.startAt);

// Split at render time so a stale snapshot never shows a past event as upcoming.
export function splitEvents(now = new Date()) {
  const all = [...fromLuma, ...ARCHIVE].sort(byStart);
  const upcoming = all.filter(e => new Date(e.startAt) >= now);
  const past = all.filter(e => new Date(e.startAt) < now).reverse();
  return { upcoming, past };
}

// Academic terms run Jan–May (Spring) and Aug–Dec (Fall).
export function termOf(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() < 6 ? 'Spring' : 'Fall'} ${d.getFullYear()}`;
}

const ET = 'America/New_York';

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: ET }).format(new Date(iso));

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: ET }).format(new Date(iso));

export const formatShort = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: ET }).format(new Date(iso));
