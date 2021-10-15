import { TextInput } from 'grommet';
import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Components/Button';
import { Card } from '../Components/Card';
import { MainStore } from '../Store/mainStore';
import { NFT } from '../types';

export const TransferModal = () => {
  const [nft, setNft] = useState<NFT | undefined>(undefined);
  const [address, setAddress] = useState('');
  const mainStore = MainStore.getInstance();
  useEffect(
    () =>
      autorun(async () => {
        const mainStore = MainStore.getInstance();
        if (!mainStore.transferModalOpen) return;
        const nft = await mainStore.getTokenData(
          parseInt(mainStore.transferModalOpen)
        );
        nft && setNft(nft);
      }),
    []
  );

  const onSend = () => {
    if (!nft) return;
    mainStore.sendToken(nft.id, address);
    mainStore.closeTransferModal();
  };

  return (
    <Container>
      <Inner>
        {nft && (
          <>
            <Card nft={nft} hideDetails num={1} />
            <InputField
              placeholder="Enter receiver wallet address"
              value={address}
              onChange={event => setAddress(event.target.value)}
            />
            <Button onClick={onSend}>Send</Button>
            <Button onClick={() => mainStore.closeTransferModal()} secondary>
              Cancel
            </Button>
          </>
        )}
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
  background-color: #000000dd;
  display: grid;
  align-items: center;
  justify-items: center;
`;

const Inner = styled.div`
  width: 400px;
  // background-color: #fff;
  border-radius: 30px;
  padding: 30px;
  display: grid;
  grid-gap: 10px;
`;

const InputField = styled.input`
  border-radius: 10px;
  padding: 8px;
  width: 100%;
  border: 3px solid #fff;
`;
