/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { ModalEnum, useModal } from '@contexts/modal';
import { useWeb3 } from '@hooks/useWeb3';
import { useStore } from '@store/store';
import {
  GeneralSanctionContractCheck,
  GeneralSanctionViewType,
  RegionCodes,
} from '@type/common';
import { StoreActionTypes } from '@type/store';

const GeneralIndex: NextPage = () => {
  const { dispatch, store } = useStore();
  const { regionCodes, sanctionPageView } = store;
  const [walletAddress, setWalletAddress] = useState<string>('');

  const [sanctionChecklist, setSanctionChecklist] = useState<
    GeneralSanctionContractCheck[] | undefined
  >(undefined);

  const { checkSanctionStatus } = useWeb3();
  const { setModal } = useModal();

  const handleChange = (e: any) => {
    setWalletAddress(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (walletAddress !== '' && regionCodes) {
      console.log(walletAddress, regionCodes);
      const sanctionCheck: GeneralSanctionContractCheck[] =
        await checkSanctionStatus(regionCodes, walletAddress);
      setSanctionChecklist(sanctionCheck);
    }
  }, [checkSanctionStatus, regionCodes, walletAddress]);

  useEffect(() => {
    dispatch({
      type: StoreActionTypes.SET_SANCTION_VIEW,
      payload: { viewType: GeneralSanctionViewType.CHECK_STATUS },
    });
  }, [dispatch]);

  // const handleBack = useCallback(async () => {
  //   dispatch({
  //     type: StoreActionTypes.SET_SANCTION_VIEW,
  //     payload: { viewType: GeneralSanctionViewType.CHECK_STATUS },
  //   });
  // }, [dispatch]);

  return (
    <Layout>
      <div className="flex flex-row">
        <Sidebar />

        <div className="flex flex-col w-full">
          <span className="text-gray-800 text-[24px] p-9 font-poppins">
            General Sanction List
          </span>
          {sanctionPageView == GeneralSanctionViewType.CHECK_STATUS ? (
            <div className="h-3/5">
              <div className="flex flex-col">
                <div className="p-10 w-[500px] h-[540px] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-black text-[22px] font-poppins">
                      Select Your Region
                    </span>
                    <div className="flex flex-col pt-12 pb-12 gap-y-4">
                      <button
                        id="dropdownDefault"
                        data-dropdown-toggle="dropdown"
                        className="text-white bg-white-input w-[300px] hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        onClick={() => {
                          setModal(ModalEnum.REGION_MODAL);
                        }}
                      >
                        {regionCodes.length > 0 ? (
                          <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row space-x-2">
                              {regionCodes.includes(RegionCodes.UK) && (
                                <img
                                  className="w-[20px] h-[20px]"
                                  src={'/img/UK.svg'}
                                  alt="arrow"
                                />
                              )}
                              {regionCodes.includes(RegionCodes.USA) && (
                                <img
                                  className="w-[20px] h-[20px]"
                                  src={'/img/US.svg'}
                                  alt="arrow"
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row justify-between items-center">
                            <span className="text-black font-poppins text-[14px] p-2">
                              Select Country
                            </span>
                            <img
                              className="w-[20px] h-[20px]"
                              src={'/img/arrow_down.svg'}
                              alt="arrow"
                            />
                          </div>
                        )}
                      </button>

                      <input
                        placeholder={'Wallet Address'}
                        onChange={handleChange}
                        className="flex items-center w-full p-3 bg-white-input text-base font-bold text-black font-poppins text-center rounded-lg placeholder:text-right hover:bg-gray-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      ></input>
                    </div>

                    <div className="w-[350px] h-[1px] border border-gray-100"></div>
                    <div className="pt-20">
                      <button
                        className="w-[300px] h-[50px] text-amber-600 border border-amber-600 rounded-lg hover:text-white hover:bg-amber-600"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                {sanctionChecklist && (
                  <div className="flex flex-col pt-10 items-center justify-between">
                    {sanctionChecklist.map(
                      (item: GeneralSanctionContractCheck, key: number) => (
                        <div
                          className="flex flex-row w-[500px] bg-white h-[40px]"
                          key={key}
                        >
                          {item.region == RegionCodes.UK ? (
                            <div className="flex flex-row items-center justify-between p-4 w-[500px]">
                              <img
                                className="w-[25px] h-[25px]"
                                src={'/img/UK.svg'}
                                alt="arrow"
                              />
                              {!item.status ? (
                                <div className="flex flex-row">
                                  <img
                                    className="w-[25px] h-[25px] space-x-2"
                                    src={'/img/checkmark.svg'}
                                    alt="arrow"
                                  />
                                  <span className="text-black text-[16px] font-poppins">
                                    Not Sanctioned
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-row space-x-2">
                                  <img
                                    className="w-[25px] h-[25px]"
                                    src={'/img/cross_icon.svg'}
                                    alt="arrow"
                                  />
                                  <span className="text-black text-[16px] font-poppins">
                                    Sanctioned
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-row items-center justify-between p-4 w-[500px]">
                              <img
                                className="w-[25px] h-[25px]"
                                src={'/img/US.svg'}
                                alt="arrow"
                              />
                              {!item.status ? (
                                <div className="flex flex-row space-x-2">
                                  <img
                                    className="w-[25px] h-[25px]"
                                    src={'/img/checkmark.svg'}
                                    alt="arrow"
                                  />
                                  <span className="text-black text-[16px] font-poppins">
                                    Not Sanctioned
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-row space-x-2">
                                  <img
                                    className="w-[25px] h-[25px]"
                                    src={'/img/cross_icon.svg'}
                                    alt="arrow"
                                  />
                                  <span className="text-black text-[16px] font-poppins">
                                    Sanctioned
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-10 w-[500px] h-[540px] bg-gray-500 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 place-self-center gap-y-10">
              {/* present lists */}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// export const getStaticProps = async (context: any) => {
//   console.log('context', context);
//   return {
//     props: {
//       view: context.params.sanctionType,
//     },
//   };
// };

// export const getStaticPaths = async (context: any) => {
//   console.log('context2', context);
//   return {
//     paths: { params: context.params.sanctionType },
//   };
// };

export default GeneralIndex;
