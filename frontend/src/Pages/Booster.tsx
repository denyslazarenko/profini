import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '../Components/Card';
import { FancyButton } from '../Components/FancyButton';
import { P } from '../Components/Text';
import { colors } from '../theme';

enum BoosterState {
  NOT_STARTED,
  IN_PROGRESS,
  HIDDEN,
  REVEALED
}

const mockNFT = {
  buyOrder: null,
  creator: '0xdd5fb125f9ef8934fa4b318512be8f9bb1d151fc',
  description: 's',
  imageUrlOriginal:
    'https://ipfs.io/ipfs/QmTU3oqtETjHUuzNyM5B2vvZSNms1T418dae8Dd3X3bShB',
  name: 'nick',
  openSeaUrl:
    'https://testnets.opensea.io/assets/0x3ba7fd6bc940fd60981ea0bc9ca8af81e9b69aec/1',
  owner: '0xdd5fb125f9ef8934fa4b318512be8f9bb1d151fc',
  price: 0,
  raw: {},
  sold: true,
  soldFor: undefined,
  tokenId: '1'
};

export const Booster = () => {
  const [state, setState] = useState<BoosterState>(BoosterState.NOT_STARTED);
  const [revealed, setRevealed] = useState(0);

  const onBuyBooster = () => {
    setState(BoosterState.HIDDEN);
  };

  const onReveal = () => {
    setState(BoosterState.REVEALED);
  };

  return (
    <Container>
      {state === BoosterState.NOT_STARTED ? (
        <Inner>
          <Headline>Buy booster pack</Headline>
          <Subheadline>
            A booster pack contains 5 random profini NFTs and costs 0.001 ETH
          </Subheadline>
          <FancyButton onClick={onBuyBooster}>Buy now</FancyButton>
        </Inner>
      ) : state === BoosterState.IN_PROGRESS ? (
        <Inner>
          <Headline>Please accept the transaction in MetaMask</Headline>
        </Inner>
      ) : state === BoosterState.HIDDEN ? (
        <Inner>
          <CardGrid>
            <Card nft={mockNFT} hidden hideDetails />
            <Card nft={mockNFT} hidden hideDetails />
            <Card nft={mockNFT} hidden hideDetails />
          </CardGrid>

          <FancyButton onClick={onReveal}>Reveal</FancyButton>
        </Inner>
      ) : state === BoosterState.REVEALED ? (
        <Inner>
          <CardGrid>
            <Card nft={mockNFT} />
            <Card nft={mockNFT} />
            <Card nft={mockNFT} />
          </CardGrid>

          <Nav to="/wallet">
            <FancyButton plain>Go to wallet</FancyButton>
          </Nav>
        </Inner>
      ) : undefined}
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
`;

const Subheadline = styled(P)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 70vw;
  grid-gap: 20px;
  margin-bottom: 20px;
`;

const Nav = styled(Link)`
  text-decoration: none;

  div {
    transition: 200ms color ease;
  }

  div:hover {
    color: ${colors.lightAccent}!important;
  }
`;
