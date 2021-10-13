import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <Bar>
      <Link to="/">Marketplace</Link>
      <Link to="/wallet">Wallet</Link>
    </Bar>
  );
};

const Bar = styled.div`
  width: 100%;
  height: 40px;
  background-color: #000;
`;
