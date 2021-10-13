import React from 'react';
import styled from 'styled-components';
import { CardGrid } from '../Components/CardGrid';
import { VectorBackground } from '../Components/VectorBackground';

export const Marketplace: React.FC = () => {
  return (
    <Container>
      <VectorBackground title={'Marketplace'}>
        <CardGrid />
      </VectorBackground>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
`;
