import styled from 'styled-components';
import { P } from './Text';
import { Button } from './Button';
import { NFT } from '../types';
import { useMemo } from 'react';

export const Card: React.FC<{
  nft: NFT;
  hidden?: boolean;
  hideDetails?: boolean;
}> = ({ nft, hidden, hideDetails }) => {
  const price = useMemo(() => {
    if (nft.price) return nft.price + ' ETH';
    if (nft.soldFor) return 'Sold for ' + nft.soldFor + ' ETH';
    return 'unlisted';
  }, [nft]);

  return (
    <Container>
      {hidden && <Hidden />}
      <Image src={nft.imageUrlOriginal} />
      {!hideDetails ? (
        <>
          {' '}
          <Price>{price}</Price>
          <Button onClick={() => window.open(nft.openSeaUrl)}>
            View on OpenSea
          </Button>
        </>
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
