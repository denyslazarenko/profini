import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { H1, P } from './Text';
import { colors } from '../theme';

export const Navbar: React.FC = () => {
  return (
    <Bar>
      <Logo to="/">profini</Logo>
      <MenuItem to="/">Marketplace</MenuItem>
      <MenuItem to="/wallet">Wallet</MenuItem>
    </Bar>
  );
};

const Bar = styled.div`
  width: 100%;
  background-color: #000;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr auto auto;
  grid-gap: 20px;
  padding: 10px;
  align-items: center;
`;

const MenuItem = styled(Link)`
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-transform: lowercase;
  transition: color 200ms ease;

  :hover {
    color: ${colors.lightAccent};
  }
`;

const Logo = styled(MenuItem)`
  font-size: 22px;
`;
