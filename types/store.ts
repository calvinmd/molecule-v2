import { providers } from 'ethers';

import {
  GeneralSanctionViewType,
  ProviderSanctionViewType,
} from '@type/common';

// eslint-disable-next-line
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum StoreActionTypes {
  SET_ACCOUNT = 'SET_ACCOUNT',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_BALANCE = 'SET_BALANCE',
  CLEAR_STATE = 'CLEAR_STATE',
  SET_REGION_CODE = 'SET_REGION_CODE',
  SET_SANCTION_VIEW = 'SET_SANCTION_VIEW',
}

export interface StoreState {
  provider?: providers.AlchemyProvider | providers.Web3Provider;
  account?: string;
  balance?: string;
  regionCodes: number[];
  sanctionPageView: GeneralSanctionViewType | ProviderSanctionViewType;
}

type StorePayload = {
  [StoreActionTypes.SET_ACCOUNT]: {
    account: string;
  };
  [StoreActionTypes.SET_PROVIDER]: {
    provider?: providers.AlchemyProvider | providers.Web3Provider;
  };
  [StoreActionTypes.SET_BALANCE]: {
    balance: string;
  };
  [StoreActionTypes.SET_REGION_CODE]: {
    regionCodes: number[];
  };
  [StoreActionTypes.SET_SANCTION_VIEW]: {
    viewType: GeneralSanctionViewType | ProviderSanctionViewType;
  };
  [StoreActionTypes.CLEAR_STATE]: undefined;
};

export type StoreActions =
  ActionMap<StorePayload>[keyof ActionMap<StorePayload>];
