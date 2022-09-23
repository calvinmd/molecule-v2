/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo } from 'react';
import { ContractTransaction, ethers } from 'ethers';

import {
  MOLECULE_FACTORY_CONTRACT_ADDRESS,
  MOLECULE_SCAN_CONTRACT_ADDRESS,
} from '@config/config';
import { useStore } from '@store/store';
import {
  GeneralSanctionContractCheck,
  ProviderBatchList,
  RegionCodes,
} from '@type/common';

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
      signer
    );
  }, [signer]);

  const moleculeFactoryContractInstance = useMemo(() => {
    return new ethers.Contract(
      MOLECULE_FACTORY_CONTRACT_ADDRESS,
      ABI.MoleculeFactoryV2,
      signer
    );
  }, [signer]);

  const checkSanctionStatus = useCallback(
    async (regionId: number[], address: string) => {
      const resultList: GeneralSanctionContractCheck[] = await Promise.all(
        regionId.map(async (region: RegionCodes) => {
          const addressCheck: ContractTransaction =
            await moleculeFactoryContractInstance.queryBatchStatus(
              region,
              ethers.utils.getAddress(address)
            );
          if (addressCheck) {
            return {
              region: region,
              status: true,
            };
          } else {
            return {
              region: region,
              status: false,
            };
          }
        })
      );

      console.log('data', resultList);

      return resultList;
    },
    [moleculeFactoryContractInstance]
  );

  const checkProviderStatus = useCallback(
    // verified or non-verified
    async (wallet: string) => {
      const providerCheck: ContractTransaction =
        await moleculeFactoryContractInstance.checkProviderStatus(wallet);
      if (providerCheck) {
        return true;
      } else {
        return false;
      }
    },
    [moleculeFactoryContractInstance]
  );

  const getProviderBatchList = useCallback(
    async (wallet: string) => {
      const getBatchList: ContractTransaction =
        await moleculeFactoryContractInstance.providercurrentBatchId(wallet);

      const numberOfBatches: number[] = Array.from(
        { length: ethers.BigNumber.from(getBatchList).toNumber() },
        (_, i) => i + 1
      );

      const providerSpecificBatchData: ProviderBatchList[] = await Promise.all(
        numberOfBatches.map(async (num: number) => {
          const batchData: ContractTransaction =
            await moleculeFactoryContractInstance.ProviderBatchData(
              ethers.utils.getAddress(wallet),
              num
            );
          const batchUserList =
            await moleculeFactoryContractInstance.BatchUserList(batchData);
          console.log(batchData);
          return {
            batchId: num,
            batchAddresses: batchUserList,
          };
        })
      );
      return providerSpecificBatchData;
    },
    [moleculeFactoryContractInstance]
  );

  const getAddressListInBatch = useCallback(
    async (batchId: number, address: string) => {
      const providerSpecificBatchData: ContractTransaction =
        await moleculeFactoryContractInstance.ProviderBatchData(
          ethers.utils.getAddress(address),
          batchId
        );

      if (providerSpecificBatchData) {
      }
      return [];
    },
    [moleculeFactoryContractInstance]
  );

  const createBatchByProvider = useCallback(
    async (addressList: string[]) => {
      if (addressList.length > 0) {
        const createBatchTx: ContractTransaction =
          await moleculeFactoryContractInstance.updateProviderBatch(
            addressList
          );
        if (createBatchTx) {
          const txConfirm = await createBatchTx.wait();
          if (txConfirm.confirmations > 0) {
            return true;
          }
        }
        return false;
      }
    },
    [moleculeFactoryContractInstance]
  );

  return {
    checkSanctionStatus,
    checkProviderStatus,
    getProviderBatchList,
    getAddressListInBatch,
    createBatchByProvider,
  };
};
