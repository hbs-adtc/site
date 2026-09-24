# HBS Automation & Deep Tech Club website

The public site for Harvard Business School's Automation & Deep Tech Club, built with React, TypeScript, and styled-components, and deployed to GitHub Pages.

## Run it locally

```bash
npm install
npm start          # http://localhost:3000/site/
```

`npm start` and `npm run build` first run `npm run sync:events`, which snapshots the club's public Luma calendar into `src/data/luma.json`. If Luma is unreachable, the existing snapshot is kept.

## Where things live

| File | What it holds |
| --- | --- |
| `src/data/pillars.ts` | The six pillars, in the mark's fixed clock order, with member-interest counts |
| `src/data/events.ts` | Speaker notes for Luma events, the pre-Luma event archive, and the speaker wall |
| `src/data/members.ts` | Rolodex aggregates, prior employers, and unattributed fun facts. **Aggregates only, no names** |
| `src/data/luma.json` | Generated. Don't edit by hand |
| `src/components/Mark.tsx` | The club mark as a component (light individual nodes, set a letter code in the hole) |
| `src/styles/theme.ts` | Design system tokens |

When a new event goes up on Luma, add its speakers to `LUMA_NOTES` in `src/data/events.ts`.

## Design

The site follows the ADT Design System v1.0: paper, ink, and crimson; Archivo and IBM Plex Mono; square corners; no shadows. Tokens live in `src/styles/theme.ts`.

## Deploy

Pushing to `main` builds and deploys to GitHub Pages. The deploy also runs hourly to refresh the Luma snapshot. Pull requests get a preview deploy.
