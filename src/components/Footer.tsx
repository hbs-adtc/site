import React from 'react';
import styled from 'styled-components';
import { BOARD_EMAIL_URL, EMAIL_URL, EVENTS_URL, JOIN_URL, LINKEDIN_URL } from '../constants';
import { MEMBER_COUNT } from '../data/members';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Button, Container, Meta } from './ui';

const FooterContainer = styled.footer`
  background: ${theme.color.ink};
  color: ${theme.color.onInkMuted};
`;

const Doors = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  > div {
    padding: clamp(40px, 5vw, 64px) clamp(0px, 4vw, 56px) clamp(32px, 4vw, 48px) 0;
  }

  > div + div {
    padding-left: clamp(24px, 4vw, 56px);
    padding-right: 0;
    border-left: 1px solid ${theme.color.onInkRule};
  }

  h2 {
    color: ${theme.color.white};
    font-size: clamp(2rem, 4.4vw, 3.4rem);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-transform: uppercase;
    margin: 14px 0 20px;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;

    > div + div {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid ${theme.color.onInkRule};
    }
  }
`;

const Copy = styled.p`
  max-width: 30rem;
  margin-bottom: 28px;
  font-size: 1.05rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Base = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px 0 28px;
  border-top: 1px solid ${theme.color.onInkRule};
`;

const Lockup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${theme.color.white};

  strong {
    display: block;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.05;
    text-transform: uppercase;
  }

  small {
    display: block;
    margin-top: 6px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${theme.color.onInkMuted};
  }
`;

const Links = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;

  a {
    font-family: ${theme.font.mono};
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${theme.color.onInkMuted};
    transition: color ${theme.motion.hover};
    display: inline-block;
    padding: 12px 0;
  }

  a:hover {
    color: ${theme.color.white};
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer id="connect">
      <Container>
        <Doors>
          <div>
            <Meta $tone="onInk">For HBS students</Meta>
            <h2>Join the club</h2>
            <Copy>
              RC, EC, MS/MBA, and partners are all welcome.
            </Copy>
            <Row>
              <Button href={JOIN_URL} target="_blank" rel="noopener noreferrer">
                Join on Eventbrite
              </Button>
            </Row>
          </div>
          <div>
            <Meta $tone="onInk">For speakers, partners, and sponsors</Meta>
            <h2>Get in front of the room</h2>
            <Copy>
              {MEMBER_COUNT} paying members across six fields. If you are building or funding deep tech, we
              would like to host you.
            </Copy>
            <Row>
              <Button href={BOARD_EMAIL_URL} $variant="reversed">
                Email the board
              </Button>
            </Row>
          </div>
        </Doors>
        <Base>
          <Lockup>
            <Mark size={44} variant="simple" color={theme.color.white} litColor={theme.color.white} />
            <div>
              <strong>
                Automation &amp;
                <br />
                Deep Tech Club
              </strong>
              <small>Harvard Business School</small>
            </div>
          </Lockup>
          <Links>
            <li>
              <a href={EVENTS_URL} target="_blank" rel="noopener noreferrer">
                Luma
              </a>
            </li>
            <li>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={EMAIL_URL}>Email</a>
            </li>
            <li>
              <Meta as="span" $tone="onInk" style={{ display: 'inline-block', padding: '12px 0' }}>
                © {new Date().getFullYear()}
              </Meta>
            </li>
          </Links>
        </Base>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
