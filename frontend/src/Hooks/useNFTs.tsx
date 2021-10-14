import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import { MainStore } from '../Store/mainStore';
import { NFTS } from '../types';

export const useNFTs = (): NFTS => {
  const [nfts, setNFTs] = useState<NFTS>({});
  const mainStore = MainStore.getInstance();

  useEffect(
    () =>
      autorun(() => {
        (async () => {
          console.log('Contracts ready', mainStore.contractsReady);
          if (!mainStore.contractsReady) return;
          const ids = (await mainStore.getTokenIds()) || [];
          for (const id of ids) {
            const nft = await mainStore.getTokenData(id);
            console.log('NFT Data', nft);
            if (!nft) continue;
            setNFTs(curr => ({ ...curr, [id]: nft }));
          }
        })();
      }),
    []
  );

  return nfts;
};
