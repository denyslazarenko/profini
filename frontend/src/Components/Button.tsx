import styled from 'styled-components';
import { colors } from '../theme';

export const Button = styled.button<{ secondary?: boolean }>`
  padding: 8px;
  border: 1px solid ${p => (p.secondary ? colors.gray : colors.lightAccent)};
  color: ${p => (p.secondary ? colors.gray : colors.lightAccent)};
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  transition: all 200ms ease;
  cursor: pointer;
  background-color: ${colors.lightAccentTransparent};

  ${p =>
    p.disabled
      ? ` 
      filter: grayscale(100%);
     `
      : `
  :hover {
    background-color: ${p.secondary ? colors.gray : colors.lightAccent};
    color: ${p.secondary ? '#000' : '#fff'};
  }
  `}

  :active {
    opacity: 0.6;
  }
`;
