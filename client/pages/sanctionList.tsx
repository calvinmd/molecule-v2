/* eslint-disable @next/next/link-passhref */

import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { useWeb3 } from '@hooks/useWeb3';
import { useStore } from '@store/store';
import { SanctionType } from '@type/common';

const SanctionList: NextPage = () => {
  const { store } = useStore();
  const { account } = store;
  const { checkProviderStatus } = useWeb3();
  const [isProvider, setIsProvider] = useState<boolean>(false);

  const checkProvider = useCallback(
    async (address: string) => {
      if (address) {
        const accountProviderCheck = await checkProviderStatus(address);
        if (accountProviderCheck) {
          return true;
        } else {
          return false;
        }
      }
    },
    [checkProviderStatus]
  );

  useEffect(() => {
    const check = async () => {
      if (account) {
        const checkAlready = await checkProvider(account);
        if (checkAlready) {
          console.log(checkAlready);
          setIsProvider(true);
        } else {
          setIsProvider(false);
        }
      }
    };

    check();
  }, [account, checkProvider]);
  return (
    <Layout>
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col w-full">
          <span className="text-gray-800 text-[24px] p-9 font-poppins">
            Sanction List
          </span>
          <div className="flex flex-col p-10 w-[500px] h-[540px] bg-gray-500 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center gap-y-10">
            <Link
              href={`/sanctions/[sanctionType]`}
              as={`/sanctions/${SanctionType.GENERAL}`}
            >
              <button className="text-white bg-gray-700 w-[300px] hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <span className="text-white font-poppins text-[16px]">
                  General
                </span>
              </button>
            </Link>

            {isProvider ? (
              <Link
                href={`/sanctions/[sanctionType]`}
                as={`/sanctions/${SanctionType.PROVIDER}`}
              >
                <button className="text-white bg-gray-700 w-[300px] hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <span className="text-white font-poppins text-[16px]">
                    Provider
                  </span>
                </button>
              </Link>
            ) : (
              <button
                className="text-white bg-gray-700 w-[300px] opacity-30 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={true}
              >
                <span className="text-white font-poppins text-[16px]">
                  Provider
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SanctionList;
