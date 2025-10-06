export const GAME_TYPE = {
  DEFAULT: 'contract',
  SURVIVE: 'survive',
};

export type GameType = (typeof GAME_TYPE[keyof typeof GAME_TYPE]);

export const CONTRACT_TYPE = {
  CONTRACT: 'CONTRACT',
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
  ERC20: 'ERC20',
  WALLET: 'WALLET',
  CHAIN_LINK: 'CHAIN_LINK',
}
export type ContractType = (typeof CONTRACT_TYPE[keyof typeof CONTRACT_TYPE]);