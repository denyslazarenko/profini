import styled from 'styled-components';
import { FancyButton } from '../Components/FancyButton';
import { P } from '../Components/Text';

export const InstallMetamask = () => {
  return (
    <Container>
      <Inner>
        <Headline>Ain't no metamask</Headline>
        <Subheadline>
          Please install MetaMask to use profini. Reload the page when you're
          done. Also, please use Google Chrome.
        </Subheadline>
        <FancyButton
          onClick={() => window.open('https://metamask.io/download.html')}
        >
          Install MetaMask
        </FancyButton>
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
