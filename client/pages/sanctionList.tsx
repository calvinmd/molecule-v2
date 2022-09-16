import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { useWeb3 } from '@hooks/useWeb3';
import { useStore } from '@store/store';
import { RegionCodes, SanctionViewType } from '@type/common';
import { StoreActionTypes } from '@type/store';

const SanctionList: NextPage = () => {
  const { dispatch, store } = useStore();
  const { regionCode, sanctionPageView } = store;
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [region, setRegion] = useState<string>('Select Country');
  const { checkSanctionStatus } = useWeb3();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setWalletAddress(e.target.value);
  };

  const handleSelectRegion = useCallback(
    (regionId: number) => {
      dispatch({
        type: StoreActionTypes.SET_REGION_CODE,
        payload: { regionCode: regionId },
      });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(async () => {
    if (walletAddress !== '' && regionCode != 0) {
      const sanctionCheck = await checkSanctionStatus(
        regionCode,
        walletAddress
      );
      if (sanctionCheck) {
        dispatch({
          type: StoreActionTypes.SET_SANCTION_VIEW,
          payload: { viewType: SanctionViewType.SANCTIONED },
        });
      } else {
        dispatch({
          type: StoreActionTypes.SET_SANCTION_VIEW,
          payload: { viewType: SanctionViewType.NON_SANCTIONED },
        });
      }
    }
  }, [checkSanctionStatus, dispatch, regionCode, walletAddress]);

  return (
    <Layout>
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col w-full">
          <span className="text-white text-[24px] p-9 font-poppins">
            General Sanction List
          </span>
          {sanctionPageView == SanctionViewType.CHECK_STATUS ? (
            <div className="h-3/5">
              <div className="flex flex-col">
                <div className="p-10 w-[500px] h-[540px] bg-gray-500 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-white text-[22px] font-poppins">
                      Select Your Region
                    </span>
                    <div className="flex flex-col pt-12 pb-12 gap-y-4">
                      <button
                        id="dropdownDefault"
                        data-dropdown-toggle="dropdown"
                        className="text-white bg-gray-700 w-[300px] hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                      >
                        <span className="text-white text-[14px] p-2">
                          {region}
                        </span>
                        <img
                          className="w-[20px] h-[20px]"
                          src={'/img/arrow_down.svg'}
                          alt="arrow"
                        />
                      </button>
                      <div
                        id="dropdown"
                        className="hidden z-10 w-[300px] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
                      >
                        <ul
                          className="py-1 w-[300px] text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownDefault"
                        >
                          <li>
                            <button
                              className="block w-[300px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => {
                                setRegion('United States of America (USA)');
                                handleSelectRegion(RegionCodes.USA);
                              }}
                            >
                              United States of America (USA)
                            </button>
                          </li>
                          <li>
                            <button
                              className="block w-[300px] py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => {
                                setRegion('United Kingdom (UK)');
                                handleSelectRegion(RegionCodes.UK);
                              }}
                            >
                              United Kingdom (UK)
                            </button>
                          </li>
                        </ul>
                      </div>

                      <input
                        placeholder={'Wallet Address'}
                        onChange={handleChange}
                        className="flex items-center w-full p-3 text-base font-bold text-white text-center rounded-lg placeholder:text-right bg-gray-700 hover:bg-gray-700 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      ></input>
                    </div>

                    <div className="w-[350px] h-[1px] border border-gray-100"></div>
                    <div className="pt-20">
                      <button
                        className="w-[300px] h-[50px] text-white border border-white rounded-lg"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : sanctionPageView == SanctionViewType.SANCTIONED ? (
              <div className="flex flex-col p-20 w-[500px] h-[540px] bg-gray-500 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center gap-y-10">
                <img
                  className="w-[200px] h-[200px] place-self-center"
                  src={'/img/cross_icon.svg'}
                  alt="not cool"
                />
                <span className="text-white font-poppins text-[24px] text-center">
                  {`This address has been sanctioned by the ${region} authorities, and is not allowed for transactions.`}
                </span>
              </div>
          ) : (
            <div className="flex flex-col p-20 w-[500px] h-[540px] bg-gray-500 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center gap-y-10">
              <img
                className="w-[200px] h-[200px] place-self-center"
                src={'/img/checkmark.svg'}
                alt="cool"
              />
              <span className="text-white font-poppins text-[24px] text-center">
                The address has not been sanctioned, and is safe for
                transactions.
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SanctionList;
