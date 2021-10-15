import styled from 'styled-components';
import { P } from './Text';
import { Button } from './Button';
import { NFT } from '../types';
import { getOpenSeaUrl } from '../Utils/utils';
import { MainStore } from '../Store/mainStore';
import Tilt from 'react-tilt'
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

export const Card: React.FC<{
  nft: NFT;
  hidden?: boolean;
  hideDetails?: boolean;
  num?: number;
}> = ({ nft, hidden, hideDetails, num }) => {
  const mainStore = MainStore.getInstance();

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  const [loaded, setLoaded] = useState(false);

  return (
    <Container>
      {
        <Number title={`You own this card ${num} times`}>
          {num ? num + 'x' : 'not owned'}
        </Number>
      }
      {(!!num && !hidden) ? (
      <Tilt className="Tilt" options={{ max : 25 }} style={{ width: "100%" }} >
        {hidden && <Hidden />}
        <Image src={nft.imageUrl} owned={!!num} loaded={loaded} onLoad={handleImageLoaded} />
      </Tilt>
      ) : (
        <Image src={nft.imageUrl} owned={!!num} loaded={loaded} onLoad={handleImageLoaded} />
      )}
      {!hideDetails ? (
          <ButtonContainer>
            <Button onClick={() => window.open(getOpenSeaUrl(nft.id))}>
              View on OpenSea
            </Button>
            <Button
              onClick={() => mainStore.openTransferModal(String(nft.id))}
              disabled={!num}
            >
              Send
            </Button>
          </ButtonContainer>
        ) : undefined}
    </Container>
  );
};

const Container = styled.div`
  padding: 10px;
  width: 100%;
  position: relative;
  justify-items: center;
  align-items: center;
`;

const Image = styled.img<{ owned: boolean, loaded: boolean }>`
  width: 100%;
  border-radius: 16px;
  transition: ease-in-out 0.2s;
  ${p => (!p.owned ? 'filter: grayscale(100%) contrast(0.4);' : '')}
  ${p =>
    p.owned
      ? `:hover {
      box-shadow: 5px 5px 10px 6px rgba(0, 0, 0, 0.25);
      transform: translateY(-10px) scale(1.02);
    }`
      : ''}
`;

const Hidden = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #8d218d;
`;

const ButtonContainer = styled.div`
  display: grid;
  margin-top: 10px;
  grid-gap: 8px;
`;

const Number = styled.p`
  display: grid;
  align-items: center;
  justify-items: center;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
`;
