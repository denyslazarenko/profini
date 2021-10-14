import { useEffect, useState } from 'react';
import { MainStore } from '../Store/mainStore';
import { NFT } from '../types';

export const useNFTs = (): NFT[] => {
  const [nfts, setNFTs] = useState<NFT[]>([]);

  const maxId = 10;

  useEffect(() => {
    (async () => {
      const mainStore = MainStore.getInstance();

      for (let i = 0; i < maxId; i++) {
        const nft = await mainStore.getTokenData(i);
        if (!nft) continue;
        setNFTs(curr => [...curr, nft]);
      }
    })();
  }, []);

  return nfts;
};
