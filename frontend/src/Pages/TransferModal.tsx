import { TextInput } from 'grommet';
import styled from 'styled-components';
import { Button } from '../Components/Button';
import { Card } from '../Components/Card';
import { NFT } from '../types';

const mockNFT: NFT = {
  imageUrl:
    'https://ipfs.io/ipfs/QmTU3oqtETjHUuzNyM5B2vvZSNms1T418dae8Dd3X3bShB',
  id: 1
};

export const TransferModal = () => {
  console.log('render modal');
  return (
    <Container>
      <Inner>
        <Card nft={mockNFT} hideDetails />
        <InputField placeholder="Enter receiver address" />
        <Button>Send</Button>
      </Inner>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #000000aa;
  display: grid;
  align-items: center;
  justify-items: center;
`;

const Inner = styled.div`
  width: 500px;
  height: 800px;
  background-color: #fff;
  border-radius: 30px;
  padding: 50px;
`;

const InputField = styled(TextInput)`
  margin-top: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 8px;
`;
