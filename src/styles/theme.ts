// Tokens from the ADT Design System v1.0. Two inks and their supports:
// crimson marks one thing per view; everything else is ink, rule, and paper.
// Radius is zero and elevation is zero; the only curves are circles.

export const theme = {
  color: {
    crimson: '#A51C30',
    crimsonDeep: '#7C1523',
    crimsonOnInk: '#FF8494', // accenting a single word on ink only
    ink: '#2B2B2B',
    body: '#4A4540',
    caption: '#6B6560',
    paper: '#F4F2EF',
    white: '#FFFFFF',
    silver: '#C9BFBB', // unlit nodes and rules, never text
    rule: '#DAD4D0',
    onInkMuted: '#B9B1AC',
    onInkRule: 'rgba(255, 255, 255, 0.16)',
  },
  font: {
    sans: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
    mono: "'IBM Plex Mono', 'Courier New', monospace",
  },
  motion: {
    hover: '120ms ease-out',
    fade: '180ms ease-out',
  },
  width: '1200px',
  gutter: 'clamp(16px, 4vw, 40px)',
} as const;
