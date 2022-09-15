/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo } from 'react';
import { ContractTransaction, ethers } from 'ethers';

import {
  MOLECULE_FACTORY_CONTRACT_ADDRESS,
  MOLECULE_SCAN_CONTRACT_ADDRESS,
} from '@config/config';
import { useStore } from '@store/store';

import ABI from '../abi/abi.json';

export const useWeb3 = () => {
  const { store } = useStore();
  const { account, provider } = store;

  const signer = provider?.getSigner();
  const signerAddress = signer?.getAddress();

  const moleculeScanContractInstance = useMemo(() => {
    return new ethers.Contract(
      MOLECULE_SCAN_CONTRACT_ADDRESS,
      ABI.MoleculeScan,
      provider
    );
  }, [provider]);

  const moleculeFactoryContractInstance = useMemo(() => {
    return new ethers.Contract(
      MOLECULE_FACTORY_CONTRACT_ADDRESS,
      ABI.MoleculeFactoryV2,
      provider
    );
  }, [provider]);

  const checkSanctionStatus = useCallback(
    async (regionId: number, address: string) => {
      const addressCheck: ContractTransaction =
        await moleculeScanContractInstance.queryBatchStatus(
          regionId,
          ethers.utils.getAddress(address)
        );
      if (addressCheck) {
        return true;
      }
      return false;
    },
    [moleculeScanContractInstance]
  );

  return {
    checkSanctionStatus,
  };
};
