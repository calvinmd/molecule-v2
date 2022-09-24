export enum WalletType {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'wallet-connect',
}

export enum RegionCodes {
  USA = 1,
  UK = 2,
}

export enum GeneralSanctionViewType {
  CHECK_STATUS = 'check_status',
  LIST_VIEW = 'list_view',
  SANCTIONED = 'sanctioned',
  NON_SANCTIONED = 'non_sanctioned',
}

export enum ProviderSanctionViewType {
  PROVIDER_BATCH_VIEW = 'provider_batch_view',
  CREATE_NEW_BATCH = 'create_new_batch',
  BATCH_LIST = 'batch-list',
  VERIFY_ADDRESS_IN_BATCH = 'verify_address_in_batch',
}

export enum SanctionType {
  GENERAL = 'general',
  PROVIDER = 'provider',
}

export enum UserType {
  PUBLIC = 'public',
  SERVICE_PROVIDER = 'service_provider',
}

export interface GeneralSanctionContractCheck {
  region: RegionCodes;
  status: boolean;
}

export interface ProviderBatchList {
  batchId: number;
  batchAddresses: string[];
}
