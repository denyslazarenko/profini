import styled from 'styled-components';
import { P } from './Text';
import example from '../assets/diepold_example.png';
import { Button } from './Button';

export const Card = () => {
  return (
    <Container>
      <Image src={example} />
      <Price>1 ETH</Price>
      <Button>View</Button>
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
