import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { EVENTS_URL } from '../constants';
import { ClubEvent, formatDay, formatShort, formatTime, splitEvents } from '../data/events';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Arrow, Button, Container, Lead, Section, SectionHead, SectionTitle } from './ui';

const GAP = 16;

const Head = styled(SectionHead)`
  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
`;

const Arrows = styled.div`
  display: flex;
  gap: 8px;

  button {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 2px solid ${theme.color.ink};
    color: ${theme.color.ink};
    transition: background ${theme.motion.hover}, color ${theme.motion.hover};
  }

  button:hover {
    background: ${theme.color.ink};
    color: ${theme.color.white};
  }
`;

// Bleeds past the container so the next card peeks in as a cue to scroll.
const Track = styled.ol`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(250px, 72vw, 290px);
  gap: ${GAP}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: ${theme.gutter};
  padding: 4px ${theme.gutter} 8px;
  margin: 0 calc(-1 * ${theme.gutter});
  scrollbar-width: none;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.li`
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: ${theme.color.white};
  border-top: 3px solid ${theme.color.crimson};

  > a {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  > a:hover img {
    opacity: 0.9;
  }

  > a:hover .cta {
    color: ${theme.color.crimsonDeep};
  }
`;

const Cover = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: ${theme.color.ink};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity ${theme.motion.hover};
  }
`;

// Typographic cover for events that predate the Luma calendar.
const Plain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 20px;

  p {
    color: ${theme.color.white};
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  padding: 14px 16px 16px;

  .when {
    font-family: ${theme.font.mono};
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${theme.color.caption};

    strong {
      font-weight: 500;
      color: ${theme.color.crimson};
    }
  }

  h3 {
    font-size: 1.05rem;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cta {
    margin-top: auto;
    padding-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${theme.color.crimson};
    transition: color ${theme.motion.hover};
  }
`;

const Chevron: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
    <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Move the track one card; going forward from the end wraps to the start.
function stepTrack(el: HTMLElement | null, dir: 1 | -1) {
  const card = el?.querySelector('li');
  if (!el || !card) return;
  const width = card.getBoundingClientRect().width + GAP;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
  const atStart = el.scrollLeft <= 8;
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior });
  else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior });
  else el.scrollBy({ left: dir * width, behavior });
}

const EventCard: React.FC<{ event: ClubEvent; upcoming: boolean }> = ({ event, upcoming }) => {
  const when = upcoming
    ? `${formatDay(event.startAt)} · ${formatTime(event.startAt)}`
    : `${formatShort(event.startAt)}, ${new Date(event.startAt).getFullYear()}`;

  const content = (
    <>
      <Cover>
        {event.cover ? (
          <img src={event.cover} alt="" loading="lazy" width={290} height={290} />
        ) : (
          <Plain>
            <Mark size={40} variant="simple" color={theme.color.white} litColor={theme.color.white} />
            <p>{event.format}</p>
          </Plain>
        )}
      </Cover>
      <Body>
        <span className="when">
          {upcoming && <strong>Upcoming · </strong>}
          {when}
        </span>
        <h3>{event.name}</h3>
        {event.url && (
          <span className="cta">
            {upcoming ? 'RSVP on Luma' : 'View on Luma'} <Arrow />
          </span>
        )}
      </Body>
    </>
  );

  return (
    <Card>
      {event.url ? (
        <a href={event.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </Card>
  );
};

const Events: React.FC = () => {
  const { upcoming, past } = useMemo(() => splitEvents(), []);
  const track = useRef<HTMLOListElement>(null);

  return (
    <Section id="events">
      <Container>
        <Head>
          <SectionTitle>Events</SectionTitle>
          <div>
            <Lead>Firesides, workshops, and site visits.</Lead>
            <Arrows>
              <button type="button" aria-label="Previous events" onClick={() => stepTrack(track.current, -1)}>
                <Chevron flip />
              </button>
              <button type="button" aria-label="More events" onClick={() => stepTrack(track.current, 1)}>
                <Chevron />
              </button>
            </Arrows>
          </div>
        </Head>

        <Track ref={track} aria-label="Upcoming and past events">
          {upcoming.map(e => (
            <EventCard key={e.id} event={e} upcoming />
          ))}
          {past.map(e => (
            <EventCard key={e.id} event={e} upcoming={false} />
          ))}
        </Track>

        <Button href={EVENTS_URL} target="_blank" rel="noopener noreferrer" $variant="ghost" style={{ marginTop: 16 }}>
          All events on Luma <Arrow />
        </Button>
      </Container>
    </Section>
  );
};

export default Events;
