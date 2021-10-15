import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Navbar } from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Marketplace } from './Pages/Marketplace';
import { Booster } from './Pages/Booster';
import { TransferModal } from './Pages/TransferModal';
import { MainStore } from './Store/mainStore';
import { observer } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetDrip } from './Pages/GetDrip';
import { InstallMetamask } from './Pages/InstallMetamask';

export const Layout: React.FC = observer(() => {
  const mainStore = MainStore.getInstance();

  const metamaskAvailable = mainStore.metamaskAvailable();
  const metamaskHasNoBalance = mainStore.balance === 0;

  return (
    <>
      <ToastContainer position="top-center" />
      <Container>
        <Router>
          <Navbar />
          {!metamaskAvailable ? (
            <DripContainer>
              <InstallMetamask />
            </DripContainer>
          ) : metamaskHasNoBalance ? (
            <DripContainer>
              <GetDrip />
            </DripContainer>
          ) : (
            <Switch>
              <Route path="/collection">
                <Marketplace />
              </Route>
              <Route path="/booster">
                <Booster />
              </Route>
              <Route path="/">
                <Marketplace />
              </Route>
            </Switch>
          )}
        </Router>
      </Container>
      {mainStore.transferModalOpen && <TransferModal />}
    </>
  );
});

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background-color: #f5f7ff;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const DripContainer = styled.div`
  width: 100vw;
  position: relative;
  background-color: #000;
  display: grid;
  align-items: center;
  justify-items: center;
`;
