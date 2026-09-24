import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MEMBERS, MEMBER_COUNT, MemberCard } from '../data/members';
import { PILLARS } from '../data/pillars';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Container, Lead, Meta, Section, SectionTitle } from './ui';

const FLIP_MS = 5000;

// A stand-in name for the blur. It is never the member's real name, so
// there is nothing in the page to un-blur.
const LETTERS = 'abcdeghiklmnoprstuvy';
function decoyName(seed: number) {
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const word = (min: number, max: number) => {
    const len = min + Math.floor(rand() * (max - min + 1));
    let w = LETTERS[Math.floor(rand() * LETTERS.length)].toUpperCase();
    for (let i = 1; i < len; i++) w += LETTERS[Math.floor(rand() * LETTERS.length)];
    return w;
  };
  return `${word(3, 7)} ${word(5, 9)}`;
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 540px);
  gap: 32px 64px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Intro = styled.div`
  ${Lead} {
    margin-top: 14px;
    color: ${theme.color.onInkMuted};
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;

  button {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 2px solid ${theme.color.white};
    color: ${theme.color.white};
    transition: background ${theme.motion.hover}, color ${theme.motion.hover};
  }

  button:hover {
    background: ${theme.color.white};
    color: ${theme.color.ink};
  }

  p {
    margin-left: 12px;
  }
`;

/* The rolodex: a stack of cards; the front one flips down to the next. */

const flipIn = keyframes`
  from { transform: rotateX(-88deg); opacity: 0.4; }
  to { transform: rotateX(0deg); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Stage = styled.div`
  position: relative;
  perspective: 1200px;
  padding-bottom: 20px;
`;

// Edges of the cards waiting behind the front one.
const Behind = styled.div<{ $depth: number }>`
  position: absolute;
  left: ${({ $depth }) => 10 + $depth * 12}px;
  right: ${({ $depth }) => 10 + $depth * 12}px;
  bottom: ${({ $depth }) => 10 - $depth * 10}px;
  height: 40px;
  background: ${({ $depth }) => ($depth ? '#B9B1AC' : '#DAD4D0')};
`;

const Card = styled.button<{ $animate: boolean }>`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  padding: 22px 24px 24px;
  text-align: left;
  cursor: pointer;
  background: ${theme.color.white};
  border-top: 3px solid ${theme.color.crimson};
  transform-origin: top center;
  ${({ $animate }) =>
    $animate
      ? css`
          animation: ${flipIn} 460ms cubic-bezier(0.16, 1, 0.3, 1);
        `
      : css`
          animation: ${fadeIn} 180ms ease-out;
        `}

`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.color.rule};

  &:hover .tease {
    opacity: 1;
  }
`;

const NameBlock = styled.div`
  position: relative;
  min-width: 0;
`;

const Name = styled.span`
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: ${theme.color.ink};
  filter: blur(7px);
  user-select: none;
`;

const Tease = styled(Meta)`
  position: absolute;
  left: 0;
  top: 2px;
  padding: 4px 6px 4px 0;
  background: ${theme.color.white};
  white-space: nowrap;
  opacity: 0;
  transition: opacity ${theme.motion.hover};
`;

const Rows = styled.dl`
  display: grid;
  gap: 12px;
  margin-top: 16px;

  dd {
    margin-top: 2px;
    color: ${theme.color.ink};
    line-height: 1.45;
  }
`;

const Chevron: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
    <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Rolodex: React.FC<{ member: MemberCard; seed: number; animate: boolean; onNext: () => void }> = ({
  member,
  seed,
  animate,
  onNext,
}) => {
  const pillar = PILLARS[member.pillar];
  return (
    <Card type="button" $animate={animate} onClick={onNext} aria-label="Flip to the next member">
      <Head>
        <Mark size={44} variant="simple" lit={member.pillar} litSpoke />
        <NameBlock>
          <Name aria-hidden="true">{decoyName(seed)}</Name>
          <Tease className="tease" $tone="crimson" aria-hidden="true">
            Nice try · come to Rolodex Night
          </Tease>
          <Meta $tone="crimson" style={{ marginTop: 4 }}>
            {member.tag} · {pillar.name}
          </Meta>
        </NameBlock>
      </Head>
      <Rows>
        <div>
          <Meta as="dt">Background</Meta>
          <dd>{member.background}</dd>
        </div>
        <div>
          <Meta as="dt">Fun fact</Meta>
          <dd>{member.funFact}</dd>
        </div>
      </Rows>
    </Card>
  );
};

const Members: React.FC = () => {
  const count = MEMBERS.length;
  const [index, setIndex] = useState(() => Math.floor(Math.random() * count));
  const [paused, setPaused] = useState(false);
  const [flips, setFlips] = useState(0);
  const reduced = prefersReducedMotion();

  const go = (delta: number) => {
    setIndex(i => (i + delta + count) % count);
    setFlips(f => f + 1);
  };

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % count);
      setFlips(f => f + 1);
    }, FLIP_MS);
    return () => window.clearInterval(id);
  }, [paused, count, reduced]);

  return (
    <Section id="members" tone="ink">
      <Container>
        <Layout
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Intro>
            <SectionTitle>About our members</SectionTitle>
            <Lead>{MEMBER_COUNT} paying members. Names off the record.</Lead>
            <Controls>
              <button type="button" aria-label="Previous member" onClick={() => go(-1)}>
                <Chevron flip />
              </button>
              <button type="button" aria-label="Next member" onClick={() => go(1)}>
                <Chevron />
              </button>
              <Meta $tone="onInk">Or click the card</Meta>
            </Controls>
          </Intro>
          <Stage aria-roledescription="carousel" aria-label="Member rolodex, names withheld" aria-live="polite">
            <Behind $depth={1} />
            <Behind $depth={0} />
            <Rolodex
              key={flips}
              member={MEMBERS[index]}
              seed={index + 1}
              animate={flips > 0 && !reduced}
              onNext={() => go(1)}
            />
          </Stage>
        </Layout>
      </Container>
    </Section>
  );
};

export default Members;
