import React from 'react';
import styled from 'styled-components';
import { PILLARS, interestShare } from '../data/pillars';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Container, Lead, Section, SectionHead, SectionTitle } from './ui';

const Ledger = styled.ol`
  border-top: 2px solid ${theme.color.ink};
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 12px 32px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${theme.color.rule};

  @media (max-width: 860px) {
    grid-template-columns: 56px minmax(0, 1fr);

    > :nth-child(3),
    > :nth-child(4) {
      grid-column: 2;
    }
  }
`;

const Name = styled.h3`
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
`;

const Focus = styled.p`
  color: ${theme.color.body};
  max-width: 30rem;
`;

const Bar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 3em;
  gap: 14px;
  align-items: center;
`;

const Track = styled.div`
  height: 10px;
  background: ${theme.color.paper};
  border: 1px solid ${theme.color.rule};

  span {
    display: block;
    height: 100%;
    background: ${theme.color.ink};
    transform-origin: left center;
    transition: transform 1100ms cubic-bezier(0.16, 1, 0.3, 1) 300ms;
  }

  section[data-in='false'] & span {
    transform: scaleX(0);
  }
`;

const Share = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${theme.color.ink};
  text-align: right;
`;

const ranked = PILLARS.map((p, clockIndex) => ({ ...p, clockIndex, share: interestShare(p) })).sort(
  (a, b) => b.share - a.share,
);
const top = ranked[0].share;

const Pillars: React.FC = () => {
  return (
    <Section id="pillars" tone="white">
      <Container>
        <SectionHead>
          <SectionTitle>Six pillars</SectionTitle>
          <Lead>Ranked by where member interest sits across the club.</Lead>
        </SectionHead>

        <Ledger>
          {ranked.map(p => (
            <Row key={p.name}>
              <Mark size={48} variant="simple" code={p.code} lit={p.clockIndex} />
              <Name>{p.name}</Name>
              <Focus>{p.focus}</Focus>
              <Bar aria-label={`${p.share}% of member interest`}>
                <Track>
                  <span style={{ width: `${(p.share / top) * 100}%` }} />
                </Track>
                <Share>{p.share}%</Share>
              </Bar>
            </Row>
          ))}
        </Ledger>
      </Container>
    </Section>
  );
};

export default Pillars;
