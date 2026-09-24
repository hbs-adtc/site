import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { JOIN_URL } from '../constants';
import { theme } from '../styles/theme';
import Mark from './Mark';
import { Button } from './ui';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${theme.color.paper};
  border-bottom: 1px solid ${theme.color.rule};
`;

// Reading progress: a crimson rule that fills along the header's bottom edge.
const Progress = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: ${theme.color.crimson};
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
`;

const Nav = styled.nav`
  max-width: ${theme.width};
  margin: 0 auto;
  padding: 10px ${theme.gutter};
  min-height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const Lockup = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.color.ink};
`;

const Wordmark = styled.span`
  font-size: 13px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-transform: uppercase;
`;

const NavLinks = styled.ul<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 860px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: ${theme.color.paper};
    border-bottom: 1px solid ${theme.color.rule};
    padding: 8px ${theme.gutter} 20px;
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  font-family: ${theme.font.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? theme.color.crimson : theme.color.body)};
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 8px;
  text-decoration-color: ${({ $active }) => ($active ? theme.color.crimson : 'transparent')};
  transition: color ${theme.motion.hover}, text-decoration-color ${theme.motion.hover};

  &:hover {
    color: ${theme.color.crimsonDeep};
  }

  @media (max-width: 860px) {
    display: block;
    padding: 14px 0;
    border-bottom: 1px solid ${theme.color.rule};
    font-size: 13px;
  }
`;

const JoinItem = styled.li`
  @media (max-width: 860px) {
    margin-top: 16px;

    a {
      width: 100%;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  color: ${theme.color.ink};

  @media (max-width: 860px) {
    display: inline-flex;
  }
`;

const LINKS = [
  { id: 'pillars', label: 'Pillars' },
  { id: 'events', label: 'Events' },
  { id: 'members', label: 'Members' },
  { id: 'leadership', label: 'Leadership' },
];

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const progress = useRef<HTMLDivElement>(null);

  // Fill the progress rule as the page scrolls.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Highlight the nav link for the section in the middle of the screen.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    const top = document.getElementById('top');
    if (top) io.observe(top);
    LINKS.forEach(link => {
      const el = document.getElementById(link.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <HeaderContainer>
      <Nav aria-label="Main">
        <Lockup href="#top" aria-label="Automation & Deep Tech Club, back to top" onClick={() => setOpen(false)}>
          <Mark size={38} variant="simple" color={theme.color.crimson} />
          <Wordmark>
            Automation &amp;
            <br />
            Deep Tech Club
          </Wordmark>
        </Lockup>

        <MenuButton
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path d="M4 4l14 14M18 4 4 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </MenuButton>

        <NavLinks id="site-menu" $open={open}>
          {LINKS.map(link => (
            <li key={link.id}>
              <NavLink
                href={`#${link.id}`}
                $active={active === link.id}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <JoinItem>
            <Button href={JOIN_URL} target="_blank" rel="noopener noreferrer" style={{ minHeight: 40 }}>
              Join the club
            </Button>
          </JoinItem>
        </NavLinks>
      </Nav>
      <Progress ref={progress} aria-hidden="true" />
    </HeaderContainer>
  );
};

export default Header;
