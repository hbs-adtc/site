// The six pillars, in the design system's fixed clock order. Index 0 sits at
// 12:00 on the mark and each step moves 60° clockwise. Never reorder.

export interface Pillar {
  name: string;
  code: string;
  clock: string;
  focus: string;
  /** Fall 2026 rolodex members who named this field in their career aspirations. */
  members: number;
}

/** Each pillar's share of all member interest, as a whole-number percent. */
export const interestShare = (p: Pillar) => {
  const total = PILLARS.reduce((sum, x) => sum + x.members, 0);
  return Math.round((p.members / total) * 100);
};

export const PILLARS: Pillar[] = [
  {
    name: 'Robotics',
    code: 'R',
    clock: '12:00',
    focus: 'Fleet deployment, actuation, autonomy, and embodied AI.',
    members: 24,
  },
  {
    name: 'Quantum',
    code: 'Q',
    clock: '02:00',
    focus: 'Quantum computing and sensing, and the cryogenic hardware underneath.',
    members: 3,
  },
  {
    name: 'Biotech',
    code: 'B',
    clock: '04:00',
    focus: 'Lab automation, AI for drug development, cell and gene therapy.',
    members: 8,
  },
  {
    name: 'Climate Tech',
    code: 'C',
    clock: '06:00',
    focus: 'Nuclear, storage, grid hardware, and industrial decarbonization.',
    members: 14,
  },
  {
    name: 'Manufacturing',
    code: 'MF',
    clock: '08:00',
    focus: 'Smart factories, scale-up, supply chains, and contract manufacturing.',
    members: 13,
  },
  {
    name: 'Materials Science',
    code: 'MS',
    clock: '10:00',
    focus: 'Semiconductors, metals, critical minerals, and new materials.',
    members: 6,
  },
];
