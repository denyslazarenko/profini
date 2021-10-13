import React from 'react';
import styled from 'styled-components';
import { Navbar } from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Wallet } from './Pages/Wallet';
import { Marketplace } from './Pages/Marketplace';

export const Layout: React.FC = () => {
  return (
    <Container>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/wallet">
            <Wallet />
          </Route>
          <Route path="/">
            <Marketplace />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fafbff;
`;
