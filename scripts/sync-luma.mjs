// Snapshots the club's public Luma calendar into src/data/luma.json.
// Luma's API does not allow browser (CORS) requests, so the site reads this
// file instead. Runs automatically before every build.
//
// Sources, both public:
// 1. The calendar feed (.ics), which lists every public event.
// 2. Each event's public page, for the cover image, RSVP count and venue.
//    Only upcoming and recent events are re-read; older events reuse the saved
//    snapshot, so a typical run makes 1–3 requests to Luma. Run with --all
//    to re-read every event once.
//
// If Luma is unreachable the existing snapshot is kept, so the build never
// fails on the network.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CALENDAR_ID = 'cal-W8lRFxvwjpGEf34';
const FEED = `https://api2.luma.com/ics/get?entity=calendar&id=${CALENDAR_ID}`;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'luma.json');

// Past events older than this keep their saved cover and RSVP count.
const REFRESH_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const PAUSE_MS = 1000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const icsDate = s => s.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6.000Z');
const icsText = s => s.replace(/\\n/g, '\n').replace(/\\([,;\\])/g, '$1');

async function readFeed() {
  const res = await fetch(FEED, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Luma calendar feed responded ${res.status}`);
  // Unfold continuation lines (RFC 5545), then split into events.
  const text = (await res.text()).replace(/\r?\n[ \t]/g, '');
  return text.split('BEGIN:VEVENT').slice(1).map(block => {
    const field = name => block.match(new RegExp(`^${name}(?:;[^:\\n]*)?:(.*)$`, 'm'))?.[1]?.trim();
    const slug = icsText(field('DESCRIPTION') ?? '').match(/https:\/\/luma\.com\/([\w-]+)/)?.[1];
    const place = icsText(field('LOCATION') ?? '');
    return {
      id: field('UID').split('@')[0],
      name: icsText(field('SUMMARY')),
      url: slug ? `https://luma.com/${slug}` : null,
      startAt: icsDate(field('DTSTART')),
      endAt: icsDate(field('DTEND')),
      location: place && !place.startsWith('http') ? place : null,
    };
  });
}

// Reads the event data Luma embeds in its public event page.
async function readEventPage(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  const html = await res.text();
  const json = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)?.[1];
  const data = json && JSON.parse(json)?.props?.pageProps?.initialData?.data;
  if (!data?.event) throw new Error(`${url} had no event data`);
  return data;
}

async function main() {
  const existing = await readFile(OUT, 'utf8').then(JSON.parse).catch(() => null);
  const saved = new Map((existing?.events ?? []).map(e => [e.id, e]));

  let feed;
  try {
    feed = await readFeed();
  } catch (err) {
    if (!existing) throw err;
    console.warn(`sync-luma: ${err.message}. Keeping the existing snapshot.`);
    return;
  }

  // `npm run sync:events -- --all` re-reads every event page once.
  const cutoff = process.argv.includes('--all') ? -Infinity : Date.now() - REFRESH_WINDOW_MS;
  let pagesRead = 0;
  const events = [];
  for (const item of feed) {
    const prev = saved.get(item.id);
    const needsPage = item.url && (!prev || new Date(item.startAt).getTime() >= cutoff);
    let page = null;
    if (needsPage) {
      if (pagesRead > 0) await sleep(PAUSE_MS);
      pagesRead += 1;
      try {
        page = await readEventPage(item.url);
        if (page.event.api_id !== item.id) throw new Error(`${item.url} is a different event`);
      } catch (err) {
        console.warn(`sync-luma: ${err.message}. Using saved data for "${item.name}".`);
        page = null;
      }
    }
    const ev = page?.event;
    events.push({
      id: item.id,
      name: item.name,
      url: item.url ?? prev?.url,
      startAt: item.startAt,
      endAt: item.endAt,
      timezone: ev?.timezone ?? prev?.timezone ?? 'America/New_York',
      // A page with a hidden address has no geo info; don't fall back to stale data then.
      location: page ? ev.geo_address_info?.address ?? null : prev?.location ?? item.location,
      cover: ev?.cover_url ?? prev?.cover ?? null,
      guests: page?.guest_count ?? prev?.guests ?? null,
    });
  }

  events.sort((a, b) => a.startAt.localeCompare(b.startAt));
  const snapshot = { syncedAt: new Date().toISOString(), events };
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`sync-luma: wrote ${events.length} events to src/data/luma.json (${pagesRead} event pages read)`);
}

main();
