import styled from 'styled-components';
import { Card } from './Card';

export const CardGrid = () => {
  return (
    <Container>
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-flow: columns;
  grid-gap: 60px 20px;
`;
