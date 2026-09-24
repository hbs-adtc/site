import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

// The club mark on its 120-unit grid: a hub, a ring of six teeth, and six
// spokes ending in nodes fixed to the pillars (index 0 at 12:00, then
// clockwise every 60°). Nodes can light individually; the mark never spins.

export const NODE_POSITIONS: [number, number][] = [
  [60, 8],
  [105, 34],
  [105, 86],
  [60, 112],
  [15, 86],
  [15, 34],
];

const SPOKES = [0, 60, 120, 180, 240, 300];
const TEETH = [30, 90, 150, 210, 270, 330];

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Lit = styled.g`
  circle,
  rect {
    transition: fill ${theme.motion.hover};
  }
`;

const Code = styled.text`
  animation: ${fadeIn} 180ms ease-out;
`;

const HitArea = styled.circle`
  fill: transparent;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    stroke: ${theme.color.crimson};
    stroke-width: 1.5;
    stroke-dasharray: 3 3;
  }
`;

interface MarkProps {
  size?: number | string;
  /** 'full' at 64px and above; 'simple' drops the teeth for 32–63px. */
  variant?: 'full' | 'simple';
  /** Which node is lit. 'all' lights every node; null leaves them all unlit. */
  lit?: number | 'all' | null;
  /** Also light the spoke that leads to the lit node. */
  litSpoke?: boolean;
  /** Letter code set in the hole in place of the hub (group icons). */
  code?: string;
  color?: string;
  litColor?: string;
  unlitColor?: string;
  title?: string;
  /** Make each node a control. Labels are read by screen readers. */
  nodeLabels?: string[];
  onNodeEnter?: (i: number) => void;
  onNodeLeave?: () => void;
  onNodeSelect?: (i: number) => void;
  className?: string;
}

const Mark: React.FC<MarkProps> = ({
  size = 64,
  variant = 'full',
  lit = 'all',
  litSpoke = false,
  code,
  color = theme.color.ink,
  litColor = theme.color.crimson,
  unlitColor = theme.color.silver,
  title,
  nodeLabels,
  onNodeEnter,
  onNodeLeave,
  onNodeSelect,
  className,
}) => {
  const simple = variant === 'simple';
  const isLit = (i: number) => lit === 'all' || lit === i;
  const interactive = Boolean(nodeLabels && onNodeSelect);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-4 -4 128 128"
      role={title && !interactive ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title || interactive ? undefined : true}
      style={{ color, flex: 'none', overflow: 'visible' }}
    >
      <Lit>
        {SPOKES.map((angle, i) => (
          <rect
            key={`s${angle}`}
            x={simple ? 58 : 58.5}
            y="14"
            width={simple ? 4 : 3}
            height="16"
            fill={litSpoke && lit === i ? litColor : 'currentColor'}
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="21" fill="none" stroke="currentColor" strokeWidth={simple ? 12 : 11} />
        {!simple &&
          TEETH.map(angle => (
            <rect key={`t${angle}`} x="56" y="22" width="8" height="10" fill="currentColor" transform={`rotate(${angle} 60 60)`} />
          ))}
        {code ? (
          <Code
            key={code}
            x="60"
            y="61"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontFamily={theme.font.sans}
            fontWeight={800}
            fontSize={code.length > 1 ? 17 : 22}
            letterSpacing="-0.5"
          >
            {code}
          </Code>
        ) : (
          <circle cx="60" cy="60" r="6" fill="currentColor" />
        )}
        {NODE_POSITIONS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={simple ? 6.5 : 6} fill={isLit(i) ? litColor : unlitColor} />
        ))}
      </Lit>
      {interactive &&
        NODE_POSITIONS.map(([cx, cy], i) => (
          <HitArea
            key={`hit${i}`}
            cx={cx}
            cy={cy}
            r="13"
            role="button"
            tabIndex={0}
            aria-label={nodeLabels![i]}
            aria-pressed={lit === i}
            onMouseEnter={() => onNodeEnter?.(i)}
            onMouseLeave={() => onNodeLeave?.()}
            onFocus={() => onNodeEnter?.(i)}
            onBlur={() => onNodeLeave?.()}
            onClick={() => onNodeSelect!(i)}
            onKeyDown={(e: React.KeyboardEvent<SVGCircleElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNodeSelect!(i);
              }
            }}
          />
        ))}
    </svg>
  );
};

export default Mark;
