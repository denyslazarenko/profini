import styled from 'styled-components';
import { colors } from '../theme';

export const Button = styled.div<{ secondary?: boolean }>`
  padding: 8px;
  border: 1px solid ${p => (p.secondary ? colors.gray : colors.lightAccent)};
  color: ${p => (p.secondary ? colors.gray : colors.lightAccent)};
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  transition: all 200ms ease;
  cursor: pointer;

  :hover {
    background-color: ${p => (p.secondary ? colors.gray : colors.lightAccent)};
    color: ${p => (p.secondary ? '#000' : '#fff')};
  }

  :active {
    opacity: 0.6;
  }
`;
