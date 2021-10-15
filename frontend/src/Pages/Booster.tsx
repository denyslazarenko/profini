import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '../Components/Card';
import { FancyButton } from '../Components/FancyButton';
import { P } from '../Components/Text';
import { MainStore } from '../Store/mainStore';
import { colors } from '../theme';
import { NFT } from '../types';
import ReactCardFlip from 'react-card-flip';
import { EmptyCard } from '../Components/EmptyCard';

const ral = require('react-awesome-loaders');

enum BoosterState {
  NOT_STARTED,
  IN_PROGRESS,
  HIDDEN,
  REVEALED,
  ERROR
}

const mockNFTOpenSea = {
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

const mockNFT: NFT = {
  imageUrl:
    'https://ipfs.io/ipfs/QmTU3oqtETjHUuzNyM5B2vvZSNms1T418dae8Dd3X3bShB',
  id: 1
};

export const Booster = () => {
  const [state, setState] = useState<BoosterState>(BoosterState.NOT_STARTED);
  const [revealed, setRevealed] = useState(0);
  const [tokens, setTokens] = useState<NFT[]>([]);
  const mainStore = MainStore.getInstance();
  const [showAirdropInput, setShowAirdropInput] = useState(false);
  const [airdropCode, setAirdropCode] = useState('');

  console.log('booster state', state);

  useEffect(() => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const code = url.searchParams.get('code');
    if (code) {
      setShowAirdropInput(true);
      setAirdropCode(code);
    }
  }, []);

  useEffect(() => {
    mainStore.on('DrawPack', async (tokenIds: string[]) => {
      const tempTokens: NFT[] = (
        await Promise.all(
          tokenIds.map(id => mainStore.getTokenData(parseInt(id)))
        )
      ).filter(token => Boolean(token)) as any;

      setTokens(tempTokens);
      setState(BoosterState.HIDDEN);
    });

    mainStore.on('Error', () => {
      console.log('Received error');
      setState(BoosterState.ERROR);
    });
  }, []);

  const onBuyBooster = async () => {
    setState(BoosterState.IN_PROGRESS);
    await mainStore.buyBooster();
  };

  const onClaimBooster = async () => {
    setState(BoosterState.IN_PROGRESS);
    await mainStore.claimBooster(airdropCode);
  };

  const onReveal = () => {
    setState(BoosterState.REVEALED);

    console.log('Flipping 1st card');
    setRevealed(1);

    setTimeout(() => {
      console.log('Flipping 2nd card');
      setRevealed(2);
    }, 2000);
    setTimeout(() => {
      console.log('Flipping 3rd card');
      setRevealed(3);
    }, 4000);
  };

  return (
    <Container>
      {state === BoosterState.NOT_STARTED ? (
        <Inner>
          {showAirdropInput ? (
            <Headline>Claim free booster pack</Headline>
          ) : (
            <Headline>Buy booster pack</Headline>
          )}
          <Subheadline>
            A booster pack contains 3 random profini NFTs and costs 2 MATIC
          </Subheadline>
          {showAirdropInput ? (
            <>
              <Input
                placeholder="Enter your airdrop code"
                value={airdropCode}
                onChange={event => setAirdropCode(event.target.value)}
              />
              <FancyButton onClick={onClaimBooster}>Claim pack</FancyButton>
              <SmallTextButton onClick={() => setShowAirdropInput(false)}>
                Don't have an airdrop code?
              </SmallTextButton>
            </>
          ) : (
            <>
              <FancyButton onClick={onBuyBooster}>Buy now</FancyButton>
              <SmallTextButton onClick={() => setShowAirdropInput(true)}>
                Got an airdrop code?
              </SmallTextButton>
            </>
          )}
        </Inner>
      ) : state === BoosterState.IN_PROGRESS ? (
        <Inner>
          <Headline>Waiting....</Headline>
          <ral.ScatterBoxLoader primaryColor={'#6366F1'} background={'#000'} />
        </Inner>
      ) : state === BoosterState.HIDDEN || state === BoosterState.REVEALED ? (
        <Inner>
          <CardGrid>
            {tokens.map((token, index) => (
              <ReactCardFlip
                isFlipped={
                  state === BoosterState.REVEALED && revealed >= index + 1
                }
                flipDirection="horizontal"
                flipSpeedFrontToBack={2.0}
              >
                <Card nft={token} hidden hideDetails num={1} />
                <Card nft={token} hideDetails num={1} />
              </ReactCardFlip>
            ))}
          </CardGrid>

          {state === BoosterState.HIDDEN ? (
            <FancyButton onClick={onReveal}>Reveal</FancyButton>
          ) : (
            <Nav to="/collection">
              <FancyButton plain>Go to collection</FancyButton>
            </Nav>
          )}
        </Inner>
      ) : state === BoosterState.ERROR ? (
        <Inner>
          <Headline>Invalid code :(</Headline>
          <SmallTextButton onClick={() => setState(BoosterState.NOT_STARTED)}>
            Try again
          </SmallTextButton>
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
  padding-top: 15px;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 70vw;
  grid-gap: 20px;
  margin-bottom: 20px;
`;

const CardFlipContainer = styled.div``;

const Nav = styled(Link)`
  text-decoration: none;

  div {
    transition: 200ms color ease;
  }

  div:hover {
    color: ${colors.lightAccent}!important;
  }
`;

const SmallTextButton = styled.p`
  margin: 20px 0;
  color: #fff;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  background-color: #000;
  border: 3px solid #fff;
  border-radius: 6px;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  width: 100%;
  font-size: 3vw;
  text-align: center;
`;
