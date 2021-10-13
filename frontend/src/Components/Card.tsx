import styled from 'styled-components';
import { P } from './Text';
import { Button } from './Button';
import { NFT } from '../types';

export const Card: React.FC<{ nft: NFT }> = ({ nft }) => {
  return (
    <Container>
      <Image src={nft.imageUrlOriginal} />
      <Price>{nft.price || 'Sold for ' + nft.soldFor} ETH</Price>
      <Button onClick={() => window.open(nft.openSeaUrl)}>View</Button>
    </Container>
  );
};

const Container = styled.div`
  paddding: 10px;
  width: 100%;
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
