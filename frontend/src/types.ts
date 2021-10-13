export interface NFT {
  name: string;
  imageUrlOriginal: string;
  tokenId: string;
  description: string;
  owner: string;
  creator: string;
  price: string;
  buyOrder: any;
  sold: boolean;
  soldFor: string | undefined;
  raw: any;
}
