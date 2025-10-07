import {
  TOKEN_GACHA_TYPE,
  TOKEN_TIER_TYPE,
} from '@libs/dao/static/common.constants';

export const GAME_TYPE = {
  DEFAULT: 'contract',
  SURVIVE: 'survive',
};
export type GameType = (typeof GAME_TYPE)[keyof typeof GAME_TYPE];

export const CONTRACT_TYPE = {
  CONTRACT: 'CONTRACT',
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
  ERC20: 'ERC20',
  WALLET: 'WALLET',
  CHAIN_LINK: 'CHAIN_LINK',
};
export type ContractType = (typeof CONTRACT_TYPE)[keyof typeof CONTRACT_TYPE];

export const TOKEN_NAME = {
  SHAPE: 'Shape',
  NUMBER: 'Number',
  GACHA: 'Gacha',
};
export type TokenName = (typeof TOKEN_NAME)[keyof typeof TOKEN_NAME];

export const SHAPE_STATUS = {
  CENTRALIZATION: 'centralization',
  DECENTRALIZATION: 'decentralization',
};
export type ShapeStatus = (typeof SHAPE_STATUS)[keyof typeof SHAPE_STATUS];

export const S_TOKEN_GACHA_TYPE = {
  [TOKEN_GACHA_TYPE.NONE]: 'None',
  [TOKEN_GACHA_TYPE.SHAPE]: 'Shape',
  [TOKEN_GACHA_TYPE.NUMBER]: 'Number',
};
export type STokenGachaType =
  (typeof S_TOKEN_GACHA_TYPE)[keyof typeof S_TOKEN_GACHA_TYPE];

export const S_TOKEN_TIER_TYPE = {
  [TOKEN_TIER_TYPE.NONE]: 'None',
  [TOKEN_TIER_TYPE.N]: 'N',
  [TOKEN_TIER_TYPE.R]: 'R',
  [TOKEN_TIER_TYPE.S_R]: 'SR',
  [TOKEN_TIER_TYPE.S_S_R]: 'SSR',
};
export type STokenTierType =
  (typeof S_TOKEN_TIER_TYPE)[keyof typeof S_TOKEN_TIER_TYPE];

export const TOKEN_LIST = {
  START: 1,
  END: 1000,
  REPEAT: 1000,
};

export const CONTRACT = {
  DEPLOYER: 'Deployer',
  DATA_ADDRESS: 'DataAddress',
  SHAPE_DATA: 'ShapeData',
  NUMBER_DATA: 'NumberData',
  GACHA_DATA: 'GachaData',
  SHAPE: 'Shape',
  NUMBER: 'Number',
  GACHA: 'Gacha',
  SHAPE_MINTER: 'ShapeMinter',
  NUMBER_MINTER: 'NumberMinter',
  GACHA_MINTER: 'GachaMinter',
};

export const CONTRACT_BY_NETWORK = {
  portfolio: {
    ADMIN: 'PortfolioAdmin',
    SERVICE: 'PortfolioService',
    FIND_TOKEN_LIST: 'FindTokenList',
    AUTHORITY: 'PortfolioAuthority',
    CENTER: 'PortfolioCenter',
  },
};
