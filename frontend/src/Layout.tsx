import React from 'react';
import styled from 'styled-components';
import { Navbar } from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Collection } from './Pages/Collection';
import { Marketplace } from './Pages/Marketplace';
import { Booster } from './Pages/Booster';

export const Layout: React.FC = () => {
  return (
    <Container>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/collection">
            <Collection />
          </Route>
          <Route path="/booster">
            <Booster />
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
  min-height: 100vh;
  position: relative;
  background-color: #f5f7ff;
  display: grid;
  grid-template-rows: auto 1fr;
`;
