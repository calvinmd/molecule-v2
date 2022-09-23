/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NextPage } from 'next';
import clsx from 'clsx';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { ModalEnum, useModal } from '@contexts/modal';
import { useWeb3 } from '@hooks/useWeb3';
import { useStore } from '@store/store';
import {
  GeneralSanctionContractCheck,
  GeneralSanctionViewType,
  ProviderBatchList,
  ProviderSanctionViewType,
  RegionCodes,
  SanctionType,
} from '@type/common';
import { StoreActionTypes } from '@type/store';

interface SanctionView {
  view: SanctionType;
}

interface BatchAddress {
  addresses: string[];
}

const Index: NextPage<SanctionView> = ({ view }) => {
  const { dispatch, store } = useStore();
  const { account, regionCodes, sanctionPageView } = store;
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [batches, setBatches] = useState<ProviderBatchList[] | undefined>(
    undefined
  );
  const [enteredAddresses, setEnteredAddresses] = useState<BatchAddress>({
    addresses: [],
  });
  const [sanctionChecklist, setSanctionChecklist] = useState<
    GeneralSanctionContractCheck[] | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addressFields, setAddressFields] = useState<number>(5);
  const [accordionElements, setAccordionElements] = useState<string[]>([]);
  const { checkSanctionStatus, getProviderBatchList, createBatchByProvider } =
    useWeb3();
  const { setModal } = useModal();

  const handleChange = (e: any) => {
    setWalletAddress(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    if (walletAddress !== '' && regionCodes) {
      const sanctionCheck: GeneralSanctionContractCheck[] =
        await checkSanctionStatus(regionCodes, walletAddress);
      setSanctionChecklist(sanctionCheck);
    }
  }, [checkSanctionStatus, regionCodes, walletAddress]);

  useEffect(() => {
    const batch = async () => {
      if (account) {
        const batchList = await getProviderBatchList(account);
        if (batchList) {
          setBatches(batchList);
        }
      }
    };

    batch();
  }, [account, getProviderBatchList]);

  useEffect(() => {
    if (view == SanctionType.GENERAL) {
      dispatch({
        type: StoreActionTypes.SET_SANCTION_VIEW,
        payload: { viewType: GeneralSanctionViewType.CHECK_STATUS },
      });
    } else {
      dispatch({
        type: StoreActionTypes.SET_SANCTION_VIEW,
        payload: { viewType: ProviderSanctionViewType.PROVIDER_BATCH_VIEW },
      });
    }
  }, [dispatch, view]);

  // const handleBack = useCallback(async () => {
  //   dispatch({
  //     type: StoreActionTypes.SET_SANCTION_VIEW,
  //     payload: { viewType: GeneralSanctionViewType.CHECK_STATUS },
  //   });
  // }, [dispatch]);

  const handleAddBatchClick = useCallback(() => {
    dispatch({
      type: StoreActionTypes.SET_SANCTION_VIEW,
      payload: { viewType: ProviderSanctionViewType.CREATE_NEW_BATCH },
    });
  }, [dispatch]);

  const handleBatchAddressSubmit = useCallback(async () => {
    console.log(enteredAddresses.addresses);
    if (enteredAddresses.addresses.length > 0) {
      const newBatch = await createBatchByProvider(enteredAddresses.addresses);
      if (newBatch) {
        toast.success('New Sanction Batch Created Successfully.');
        dispatch({
          type: StoreActionTypes.SET_SANCTION_VIEW,
          payload: { viewType: ProviderSanctionViewType.PROVIDER_BATCH_VIEW },
        });
        setEnteredAddresses({
          addresses: [],
        });
      } else {
        toast.error('A problem occurred with the transaction.');
        dispatch({
          type: StoreActionTypes.SET_SANCTION_VIEW,
          payload: { viewType: ProviderSanctionViewType.PROVIDER_BATCH_VIEW },
        });
        setEnteredAddresses({
          addresses: [],
        });
      }
    }
  }, [createBatchByProvider, dispatch, enteredAddresses.addresses]);

  return (
    <Layout>
      <div className="flex flex-row">
        <Sidebar />
        {view == SanctionType.GENERAL && (
          <div className="flex flex-col w-full">
            <span className="text-gray-800 text-[24px] p-9 font-poppins">
              General Sanction List
            </span>
            {sanctionPageView == GeneralSanctionViewType.CHECK_STATUS ? (
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
                              <span className="text-white text-[14px] p-2">
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
                  {sanctionChecklist && (
                    <div className="flex flex-col pt-10 items-center justify-between">
                      {sanctionChecklist.map(
                        (item: GeneralSanctionContractCheck, key: number) => (
                          <div
                            className="flex flex-row w-full bg-white h-[40px]"
                            key={key}
                          >
                            {item.region == RegionCodes.UK ? (
                              <div className="flex flex-row items-center justify-between p-4 w-full">
                                <img
                                  className="w-[25px] h-[25px]"
                                  src={'/img/UK.svg'}
                                  alt="arrow"
                                />
                                {!item.status ? (
                                  <span className="text-black text-[16px] font-poppins">
                                    Not Sanctioned
                                  </span>
                                ) : (
                                  <span className="text-black text-[16px] font-poppins">
                                    Sanctioned
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-row items-center justify-between p-4 w-full">
                                <img
                                  className="w-[25px] h-[25px]"
                                  src={'/img/US.svg'}
                                  alt="arrow"
                                />
                                {!item.status ? (
                                  <span className="text-black text-[16px] font-poppins">
                                    Not Sanctioned
                                  </span>
                                ) : (
                                  <span className="text-black text-[16px] font-poppins">
                                    Sanctioned
                                  </span>
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
        )}
        {view == SanctionType.PROVIDER && (
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between items-center p-10">
              <span className="text-gray-800 text-[24px] font-poppins">
                Provider Sanction List
              </span>
              <button
                className="p-2 text-amber-600 border border-amber-600 rounded-lg"
                onClick={handleAddBatchClick}
              >
                Add Address List
              </button>
            </div>

            {sanctionPageView ==
            ProviderSanctionViewType.PROVIDER_BATCH_VIEW ? (
              <div className="flex flex-col p-10">
                {batches &&
                  [...Array(batches.length)].map((e: any, i: number) => {
                    return (
                      <>
                        <h2 id="accordion-example-heading-1">
                          <button
                            type="button"
                            key={i}
                            className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 font-poppins border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => {
                              if (
                                !accordionElements.includes(`Batch ${i + 1}`)
                              ) {
                                setAccordionElements([
                                  ...accordionElements,
                                  `Batch ${i + 1}`,
                                ]);
                              } else {
                                const index = accordionElements.indexOf(
                                  `Batch ${i + 1}`
                                );
                                if (index > -1) {
                                  // only splice array when item is found
                                  setAccordionElements(
                                    accordionElements.splice(index + 1, 1)
                                  ); // 2nd parameter means remove one item only
                                }
                              }
                            }}
                            aria-expanded={true}
                            aria-controls="accordion-example-body-1"
                          >
                            <span>{`Batch ${i + 1}`}</span>
                            <svg
                              data-accordion-icon
                              className="w-6 h-6 rotate-180 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </h2>
                        <div
                          id="accordion-example-body-1"
                          className={clsx({
                            block: accordionElements.includes(`Batch ${i + 1}`),
                            hidden: !accordionElements.includes(
                              `Batch ${i + 1}`
                            ),
                          })}
                          aria-labelledby="accordion-example-heading-1"
                        >
                          <div className="flex flex-col p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                            {batches[i].batchAddresses.map(
                              (address: string, i: number) => (
                                <span
                                  className="text-black text-[20px] font-poppins"
                                  key={i}
                                >
                                  {address}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col p-10">
                <div className="flex flex-col gap-y-2">
                  <span className="text-black text-[22px] font-poppins">
                    Add New Batch
                  </span>
                  <span className="text-gray-500 text-[16px] font-poppins">
                    Create a new batch of blacklisted addresses that will not be
                    allowed to interact with your platform.
                  </span>
                </div>
                <div className="flex flex-col w-full items-center gap-y-4 py-10">
                  {[...Array(addressFields)].map((e: any, i: number) => {
                    return (
                      <input
                        placeholder="address"
                        key={i}
                        onChange={(e) =>
                          setEnteredAddresses({
                            addresses: [
                              ...enteredAddresses.addresses.slice(0, i),
                              e.target.value,
                              ...enteredAddresses.addresses.slice(i + 1),
                            ],
                          })
                        }
                        className="flex items-center w-3/5 p-3 text-base font-medium font-poppins text-black rounded-lg placeholder:text-right bg-white group shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      ></input>
                    );
                  })}

                  <button
                    className="p-2 text-amber-600 border border-amber-600 rounded-lg w-1/4 hover:bg-amber-600 hover:text-white hover:shadow"
                    onClick={handleBatchAddressSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context: any) => {
  return {
    props: {
      view: context.params.sanctionType,
    },
  };
};

export default Index;
