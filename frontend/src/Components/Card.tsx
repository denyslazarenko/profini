import styled from 'styled-components';
import { P } from './Text';
import { Button } from './Button';
import { NFT } from '../types';
import { useMemo } from 'react';
import { getOpenSeaUrl } from '../Utils/utils';
import { MainStore } from '../Store/mainStore';

export const Card: React.FC<{
  nft: NFT;
  hidden?: boolean;
  hideDetails?: boolean;
}> = ({ nft, hidden, hideDetails }) => {
  const mainStore = MainStore.getInstance();
  // const price = useMemo(() => {
  //   if (nft.price) return nft.price + ' ETH';
  //   if (nft.soldFor) return 'Sold for ' + nft.soldFor + ' ETH';
  //   return 'unlisted';
  // }, [nft]);

  return (
    <Container>
      {hidden && <Hidden />}
      <Image src={nft.imageUrl} />
      {!hideDetails ? (
        <ButtonContainer>
          {/* <Price>{price}</Price> */}
          <Button onClick={() => window.open(getOpenSeaUrl(nft.id))}>
            View on OpenSea
          </Button>
          <Button onClick={() => mainStore.openTransferModal(String(nft.id))}>
            Send
          </Button>
        </ButtonContainer>
      ) : undefined}
    </Container>
  );
};

const Container = styled.div`
  paddding: 10px;
  width: 100%;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 16px;
  box-shadow: 5px 5px 10px 6px rgba(0,0,0,0.25);
  transition: ease-in-out .2s;
  :hover {
    transform: translateY(-10px) scale(1.02);
  }
`;

const Price = styled(P)`
  color: #000;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
  font-size: 18px;
`;

const Hidden = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: gray;
`;

const ButtonContainer = styled.div`
  display: grid;
  margin-top: 10px;
  grid-gap: 8px;
`;
