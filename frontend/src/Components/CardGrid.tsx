import styled from 'styled-components';
import { NFTS } from '../types';
import { Card } from './Card';

export const CardGrid: React.FC<{ nfts: NFTS }> = ({ nfts }) => {
  return (
    <Container>
      {Object.values(nfts).map(nft => (
        <Card key={'nft' + nft.id} nft={nft} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-flow: columns;
  grid-gap: 60px 20px;
`;
