import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { JOIN_URL } from '../constants';
import { PILLARS } from '../data/pillars';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Arrow, Button, Container, Meta } from './ui';

const TEASE_MS = 3200;

const HeroSection = styled.section`
  padding: clamp(32px, 5vw, 64px) 0 clamp(40px, 5vw, 64px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 32px 48px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 8.4vw, 6rem);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin: 18px 0 28px;

  em {
    font-style: normal;
    color: ${theme.color.crimson};
  }
`;

const Description = styled.p`
  font-size: clamp(1.1rem, 1.6vw, 1.3rem);
  line-height: 1.5;
  max-width: 30rem;
  margin-bottom: 36px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
`;

/* Pillar dial: the mark as the page's signature control. */

// The caption box is wider than the mark and has a fixed height, so a long
// pillar name never wraps and never pushes the layout around.
const Dial = styled.div`
  justify-self: center;
  width: 100%;
  max-width: 480px;

  svg {
    display: block;
    width: 100%;
    max-width: 360px;
    height: auto;
    margin: 0 auto;
    padding: clamp(8px, 2vw, 20px);
  }

  @media (max-width: 960px) {
    svg {
      max-width: 280px;
    }
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Caption = styled.div`
  margin-top: 12px;
  height: 128px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeIn} 180ms ease-out;

  h2 {
    font-size: clamp(1.4rem, 2.6vw, 2rem);
    white-space: nowrap;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  p {
    max-width: 22rem;
    margin: 0 auto;
    color: ${theme.color.body};
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PillarDial: React.FC = () => {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);

  // Tease each pillar in clock order until someone takes over.
  useEffect(() => {
    if (hovering || pinned || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive(a => (a + 1) % PILLARS.length), TEASE_MS);
    return () => window.clearInterval(id);
  }, [hovering, pinned]);

  const pillar = PILLARS[active];

  return (
    <Dial>
      <Mark
        size="100%"
        lit={active}
        litSpoke
        code={pillar.code}
        nodeLabels={PILLARS.map(p => p.name)}
        onNodeEnter={i => {
          setHovering(true);
          setActive(i);
        }}
        onNodeLeave={() => setHovering(false)}
        onNodeSelect={i => {
          setPinned(p => !(p && active === i));
          setActive(i);
        }}
      />
      <Caption key={pillar.name} aria-live="polite">
        <h2>{pillar.name}</h2>
        <p>{pillar.focus}</p>
      </Caption>
    </Dial>
  );
};

const Hero: React.FC = () => {
  return (
    <HeroSection id="top">
      <Container style={{ width: '100%' }}>
        <Grid>
          <div>
            <Meta $tone="crimson">Harvard Business School</Meta>
            <Title>
              Deep tech, built by <em>operators.</em>
            </Title>
            <Description>
              HBS’s community for commercializing technology that touches the physical world.
            </Description>
            <Actions>
              <Button href={JOIN_URL} target="_blank" rel="noopener noreferrer">
                Join the club
              </Button>
              <Button href="#events" $variant="ghost">
                Upcoming events <Arrow />
              </Button>
            </Actions>
          </div>
          <PillarDial />
        </Grid>
      </Container>
    </HeroSection>
  );
};

export default Hero;
