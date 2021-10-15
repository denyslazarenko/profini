import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CardGrid } from '../Components/CardGrid';
import { VectorBackground } from '../Components/VectorBackground';
import { useNFTs } from '../Hooks/useNFTs';
import { useOwnNFTs } from '../Hooks/useOwnNFTs';

const ral = require('react-awesome-loaders');

export const Marketplace: React.FC = () => {
  const nfts = useNFTs();
  const ownedNfts = useOwnNFTs();
  console.log('ownedNfts', ownedNfts);

  return (
    <Container>
      <VectorBackground title={'Collection'}>
        {Object.keys(nfts).length === 0 ? (
          <Inner>
            <ral.ScatterBoxLoader primaryColor={'#6366F1'} background={'#FFF'} />
          </Inner>
        ) : (
          <CardGrid nfts={nfts} ownedNfts={ownedNfts} />
        )}
      </VectorBackground>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
`;

const Inner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`