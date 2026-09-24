// Snapshots the club's public Luma calendar into src/data/luma.json.
// Luma's API does not allow browser (CORS) requests, so the site reads this
// file instead. Runs automatically before every build; if Luma is unreachable
// the existing snapshot is kept so the build never fails on the network.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CALENDAR_ID = 'cal-W8lRFxvwjpGEf34';
const API = 'https://api2.luma.com/calendar/get-items';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'luma.json');

async function fetchPeriod(period) {
  const entries = [];
  let cursor;
  do {
    const params = new URLSearchParams({
      calendar_api_id: CALENDAR_ID,
      period,
      pagination_limit: '50',
    });
    if (cursor) params.set('pagination_cursor', cursor);
    const res = await fetch(`${API}?${params}`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`Luma ${period} responded ${res.status}`);
    const body = await res.json();
    entries.push(...(body.entries ?? []));
    cursor = body.has_more ? body.next_cursor : undefined;
  } while (cursor);
  return entries;
}

function toEvent(entry) {
  const e = entry.event;
  return {
    id: e.api_id,
    name: e.name.trim(),
    url: `https://luma.com/${e.url}`,
    startAt: e.start_at,
    endAt: e.end_at,
    timezone: e.timezone,
    location: e.geo_address_info?.address ?? null,
    cover: e.cover_url ?? null,
    guests: entry.guest_count ?? null,
  };
}

async function main() {
  try {
    const [future, past] = await Promise.all([fetchPeriod('future'), fetchPeriod('past')]);
    const byId = new Map();
    for (const entry of [...future, ...past]) byId.set(entry.event.api_id, toEvent(entry));
    const events = [...byId.values()].sort((a, b) => a.startAt.localeCompare(b.startAt));
    const snapshot = { syncedAt: new Date().toISOString(), events };
    await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`sync-luma: wrote ${events.length} events to src/data/luma.json`);
  } catch (err) {
    const existing = await readFile(OUT, 'utf8').catch(() => null);
    if (!existing) throw err;
    console.warn(`sync-luma: ${err.message}. Keeping the existing snapshot.`);
  }
}

main();
