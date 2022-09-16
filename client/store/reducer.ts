import { SanctionViewType } from '@type/common';
import { StoreActions, StoreActionTypes, StoreState } from '@type/store';

export const initialState: StoreState = {
  provider: undefined,
  account: undefined,
  balance: '0',
  regionCode: 0,
  sanctionPageView: SanctionViewType.CHECK_STATUS,
};

const reducer = (state: StoreState, action: StoreActions) => {
  switch (action.type) {
    case StoreActionTypes.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload.account,
      };
    case StoreActionTypes.SET_PROVIDER:
      return {
        ...state,
        provider: action.payload.provider,
      };
    case StoreActionTypes.SET_BALANCE:
      return {
        ...state,
        balance: action.payload.balance,
      };
    case StoreActionTypes.SET_REGION_CODE:
      return {
        ...state,
        regionCode: action.payload.regionCode,
      };
    case StoreActionTypes.SET_SANCTION_VIEW:
      return {
        ...state,
        sanctionPageView: action.payload.viewType,
      };
    case StoreActionTypes.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
