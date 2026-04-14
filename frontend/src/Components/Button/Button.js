import React from 'react';
import styled from 'styled-components';

function Button({ name, icon, onClick, bg, bPad, color, bRad, type = 'button', ariaLabel }) {
  return (
    <ButtonStyled
      type={type}
      style={{
        background: bg || 'var(--primary-color)',
        padding: bPad || '0.75rem 1.5rem',
        borderRadius: bRad || '12px',
        color: color || '#fff',
      }}
      onClick={onClick}
      aria-label={ariaLabel || name}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{name}</span>
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button`
  outline: none;
  border: none;
  font-family: inherit;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    font-size: 1.1em;
  }

  /* 📱 Mobile responsiveness */
  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
    border-radius: 10px;
    .btn-text {
      font-size: 0.95rem;
    }
  }
`;

export default Button;