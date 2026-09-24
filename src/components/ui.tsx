import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/theme';

export const Container = styled.div`
  max-width: ${theme.width};
  margin: 0 auto;
  padding: 0 ${theme.gutter};
`;

type Tone = 'paper' | 'white' | 'ink';

const grounds: Record<Tone, string> = {
  paper: theme.color.paper,
  white: theme.color.white,
  ink: theme.color.ink,
};

// Sections alternate grounds so each one reads as its own block, and their
// content rises into place the first time it scrolls into view.
const SectionEl = styled.section<{ $tone: Tone }>`
  padding: clamp(48px, 6vw, 80px) 0;
  background: ${({ $tone }: { $tone: Tone }) => grounds[$tone]};

  ${({ $tone }: { $tone: Tone }) =>
    $tone === 'ink' &&
    css`
      color: ${theme.color.onInkMuted};

      h2,
      h3 {
        color: ${theme.color.white};
      }
    `}

  > div > * {
    transition: opacity 600ms ease-out, transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  > div > *:nth-child(2) {
    transition-delay: 100ms;
  }

  > div > *:nth-child(n + 3) {
    transition-delay: 200ms;
  }

  &[data-in='false'] > div > * {
    opacity: 0;
    transform: translateY(32px);
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Section: React.FC<{ id?: string; tone?: Tone; children: React.ReactNode }> = ({
  id,
  tone = 'paper',
  children,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <SectionEl ref={ref} id={id} $tone={tone} data-in={inView}>
      {children}
    </SectionEl>
  );
};

// Mono is metadata only: uppercase, letter-spaced, small, never a sentence.
export const Meta = styled.p<{ $tone?: 'crimson' | 'caption' | 'onInk' }>`
  font-family: ${theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.5;
  color: ${({ $tone }) =>
    $tone === 'crimson' ? theme.color.crimson : $tone === 'onInk' ? theme.color.onInkMuted : theme.color.caption};
`;

export const SectionHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px 64px;
  align-items: end;
  margin-bottom: clamp(24px, 3.5vw, 40px);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4.4vw, 3.25rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.035em;
  text-transform: uppercase;
`;

export const Lead = styled.p`
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  max-width: 34rem;
  color: ${theme.color.body};
`;

type ButtonVariant = 'primary' | 'secondary' | 'reversed' | 'ghost';

const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${theme.color.crimson};
    color: ${theme.color.white};
    border-color: ${theme.color.crimson};
    &:hover {
      background: ${theme.color.crimsonDeep};
      border-color: ${theme.color.crimsonDeep};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${theme.color.ink};
    border-color: ${theme.color.ink};
    &:hover {
      background: ${theme.color.ink};
      color: ${theme.color.white};
    }
  `,
  reversed: css`
    background: ${theme.color.white};
    color: ${theme.color.ink};
    border-color: ${theme.color.white};
    &:hover {
      background: transparent;
      color: ${theme.color.white};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.color.ink};
    border-color: transparent;
    padding-left: 0;
    padding-right: 0;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
    text-decoration-color: ${theme.color.silver};
    &:hover {
      color: ${theme.color.crimsonDeep};
      text-decoration-color: currentColor;
    }
  `,
};

// Uppercase, verb first. Square corners, no shadow.
export const Button = styled.a<{ $variant?: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 22px;
  border: 2px solid transparent;
  font-family: ${theme.font.sans};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: background ${theme.motion.hover}, color ${theme.motion.hover},
    border-color ${theme.motion.hover}, text-decoration-color ${theme.motion.hover};
  ${({ $variant = 'primary' }: { $variant?: ButtonVariant }) => variants[$variant]}
`;

export const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);
