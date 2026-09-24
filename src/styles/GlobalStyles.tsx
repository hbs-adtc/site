import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 72px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${theme.font.sans};
    font-weight: 500;
    font-size: 16px;
    background: ${theme.color.paper};
    color: ${theme.color.body};
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    font-variant-numeric: tabular-nums;
  }

  ::selection {
    background: ${theme.color.crimson};
    color: ${theme.color.white};
  }

  :focus-visible {
    outline: 2px solid ${theme.color.crimson};
    outline-offset: 3px;
  }

  h1, h2, h3, h4 {
    color: ${theme.color.ink};
    font-weight: 700;
    line-height: 1.1;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.color.paper};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.color.silver};
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *, *::before, *::after {
      transition-duration: 0ms !important;
    }
  }
`;

const GlobalStylesComponent: React.FC = () => {
  return <GlobalStyles />;
};

export default GlobalStylesComponent;
