import { useState } from 'react';
import styled from 'styled-components';
import { FancyButton } from '../Components/FancyButton';
import { P } from '../Components/Text';
import { MainStore } from '../Store/mainStore';

enum State {
  NOT_STARTED,
  WAITING
}

export const GetDrip = () => {
  const mainStore = MainStore.getInstance();
  const [state, setState] = useState(State.NOT_STARTED);

  const onRequestDrip = async () => {
    setState(State.WAITING);
    await mainStore.getDrip();
  };

  return (
    <Container>
      <Inner>
        {state === State.NOT_STARTED ? (
          <>
            <Headline>Seems like you're broke</Headline>
            <Subheadline>
              Have some free MATIC tokens to use profini.
            </Subheadline>
            <FancyButton onClick={onRequestDrip}>Get drip</FancyButton>
          </>
        ) : state === State.WAITING ? (
          <Headline>Waiting...</Headline>
        ) : undefined}
      </Inner>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100%;
  width: 100vw;
  background-color: #000;
  display: grid;
  align-content: center;
  justify-content: center;
  justify-items: center;
`;

const Inner = styled.div`
  display: grid;
  grid-gap: 20px;
  justify-items: center;
  max-width: 80vw;
`;

const Headline = styled.h1`
  font-size: 80px;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    text-align: center;
    font-size: 10vw;
  }
`;

const Subheadline = styled(P)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;
