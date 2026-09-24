import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Container, Meta, Section, SectionTitle } from './ui';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 2px solid ${theme.color.ink};

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Person = styled.li`
  padding: 20px 20px 20px 0;
  border-bottom: 1px solid ${theme.color.rule};

  @media (min-width: 961px) {
    & + & {
      padding-left: 20px;
      border-left: 1px solid ${theme.color.rule};
    }
  }

  @media (max-width: 520px) {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 0 20px;
    align-items: center;
    padding: 20px 0;
  }
`;

// Avatars are circles: the only curves the system allows besides the mark.
const Photo = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  background: ${theme.color.silver};
  margin-bottom: 14px;

  @media (max-width: 520px) {
    width: 88px;
    height: 88px;
    margin-bottom: 0;
  }
`;

const Name = styled.h3`
  font-size: 1.35rem;
  line-height: 1.15;
  margin: 6px 0 8px;
`;

const Before = styled.p`
  font-size: 0.95rem;
  color: ${theme.color.body};
`;

const leadership = [
  {
    name: 'Tyler Mangini',
    title: 'Co-President',
    before: 'Co-founder of Interlock Systems. Previously Amazon Robotics and Clean Energy Ventures.',
    photo: `${process.env.PUBLIC_URL}/tyler.png`,
  },
  {
    name: 'Gurshaan Madan',
    title: 'Co-President',
    before: 'Previously hardware PM at Apple, QuantumScape, and McKinsey Advanced Industries.',
    photo: `${process.env.PUBLIC_URL}/gurshaan.jpeg`,
  },
  {
    name: 'Tom Stotzer',
    title: 'Chief Operating Officer',
    before: 'Previously process engineer at 3M, Performance Drone Works, and Kearney.',
    photo: `${process.env.PUBLIC_URL}/tom.jpeg`,
  },
  {
    name: 'Nathan Shiham Alam',
    title: 'Chief Financial Officer',
    before: 'Previously SpaceX automation, Scale AI and Amazon engineering, and Nuro autonomy.',
    photo: `${process.env.PUBLIC_URL}/nathan.png`,
  },
];

const Leadership: React.FC = () => {
  return (
    <Section id="leadership" tone="white">
      <Container>
        <SectionTitle style={{ marginBottom: 'clamp(24px, 3.5vw, 40px)' }}>Leadership</SectionTitle>
        <Grid>
          {leadership.map(leader => (
            <Person key={leader.name}>
              <Photo src={leader.photo} alt="" loading="lazy" width={120} height={120} />
              <div>
                <Meta $tone="crimson">{leader.title}</Meta>
                <Name>{leader.name}</Name>
                <Before>{leader.before}</Before>
              </div>
            </Person>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Leadership;
