// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* 🌍 CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
  }

  :root {
    --primary-color: #222260;
    --color-green: #42AD00;
    --color-grey: #AAA;
    --color-accent: #F56692;
    --color-delete: #FF0000;
    --bg-light: #fcf6f9;

    /* 🌈 Responsive font scaling */
    --font-small: clamp(0.85rem, 1.2vw, 0.95rem);
    --font-medium: clamp(1rem, 1.5vw, 1.1rem);
    --font-large: clamp(1.2rem, 2vw, 1.4rem);
  }

  body {
    font-family: 'Nunito', sans-serif;
    background-color: var(--bg-light);
    color: rgba(34, 34, 96, 0.6);
    font-size: var(--font-medium);
    overflow-x: hidden;
    min-height: 100vh;
    transition: all 0.3s ease;
    line-height: 1.6;
    -webkit-tap-highlight-color: transparent; /* mobile tap highlight fix */
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
    font-weight: 700;
  }

  h1 {
    font-size: var(--font-large);
  }

  h2 {
    font-size: clamp(1.1rem, 2vw, 1.3rem);
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    transition: all 0.2s ease;
  }

  button:active {
    transform: scale(0.97);
  }

  /* 🔴 Error Animation */
  .error {
    color: red;
    animation: shake 0.4s ease-in-out;
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(8px); }
    50% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
    100% { transform: translateX(0); }
  }

  /* 🧭 Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(34, 34, 96, 0.3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 34, 96, 0.5);
  }

  /* 📱 Mobile Styles */
  @media (max-width: 900px) {
    body {
      font-size: var(--font-small);
      padding: 0.5rem;
    }

    h1, h2 {
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    body {
      font-size: var(--font-small);
      padding: 0.5rem 0.8rem;
    }

    h1 {
      font-size: 1.2rem;
    }

    h2 {
      font-size: 1rem;
    }

    button {
      padding: 0.6rem 1rem;
      border-radius: 8px;
    }
  }
`;
