import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CardGrid } from '../Components/CardGrid';
import { VectorBackground } from '../Components/VectorBackground';
import { useNFTs } from '../Hooks/useNFTs';
import { MainStore } from '../Store/mainStore';

export const Marketplace: React.FC = () => {
  // const nfts = useNFTs();
  const mainStore = MainStore.getInstance();
  const uri = mainStore.getTokenData(1);

  return (
    <Container>
      <VectorBackground title={'Marketplace'}>
        <CardGrid nfts={[]} />
      </VectorBackground>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
`;
