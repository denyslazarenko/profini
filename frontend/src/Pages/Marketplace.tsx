import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CardGrid } from '../Components/CardGrid';
import { VectorBackground } from '../Components/VectorBackground';
import { useNFTs } from '../Hooks/useNFTs';

export const Marketplace: React.FC = () => {
  const nfts = useNFTs();

  return (
    <Container>
      <VectorBackground title={'Marketplace'}>
        <CardGrid nfts={nfts} />
      </VectorBackground>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
`;
