/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NextPage } from 'next';
import clsx from 'clsx';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { useWeb3 } from '@hooks/useWeb3';
import { useStore } from '@store/store';
import { ProviderBatchList, ProviderSanctionViewType } from '@type/common';
import { StoreActionTypes } from '@type/store';

interface BatchAddress {
  addresses: string[];
}

interface VerifySanctionMessage {
  status?: boolean;
  message?: string;
}

const ProviderIndex: NextPage = () => {
  const { dispatch, store } = useStore();
  const { account, sanctionPageView } = store;
  const [batchId, setBatchId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressFields, setAddressFields] = useState<number>(5); //setAddressFields ot increase number of input fields
  const [accordionElements, setAccordionElements] = useState<string[]>([]);
  const [batches, setBatches] = useState<ProviderBatchList[] | undefined>(
    undefined
  );
  const [message, setMessage] = useState<VerifySanctionMessage>({
    status: undefined,
    message: undefined,
  });
  const [enteredAddresses, setEnteredAddresses] = useState<BatchAddress>({
    addresses: [],
  });

  const { getProviderBatchList, createBatchByProvider, verifyAddressInBatch } =
    useWeb3();

  const handleBatchChange = (e: any) => {
    setBatchId(e.target.value);
  };

  const handleAddressInput = (e: any) => {
    setAddress(e.target.value);
  };

  const handleBatchAddressVerifySubmit = useCallback(async () => {
    if (account) {
      const verify = await verifyAddressInBatch(
        parseInt(batchId),
        address,
        account
      );
      if (verify) {
        setMessage({ status: true, message: 'Sanctioned' });
      } else {
        setMessage({ status: false, message: 'Not Sanctioned' });
      }
    }
  }, [account, address, batchId, verifyAddressInBatch]);

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

  const handleAddBatchClick = useCallback(() => {
    dispatch({
      type: StoreActionTypes.SET_SANCTION_VIEW,
      payload: { viewType: ProviderSanctionViewType.CREATE_NEW_BATCH },
    });
  }, [dispatch]);

  const handleVerifyAddressInBatch = useCallback(() => {
    dispatch({
      type: StoreActionTypes.SET_SANCTION_VIEW,
      payload: { viewType: ProviderSanctionViewType.VERIFY_ADDRESS_IN_BATCH },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: StoreActionTypes.SET_SANCTION_VIEW,
      payload: { viewType: ProviderSanctionViewType.PROVIDER_BATCH_VIEW },
    });
  }, [dispatch]);

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
  return (
    <Layout>
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center p-10">
            <span className="text-gray-800 text-[24px] font-poppins">
              Provider Sanction List
            </span>
            <div className="flex flex-row space-x-2">
              <button
                className="p-2 text-amber-600 border border-amber-600 rounded-lg hover:text-white hover:bg-amber-600"
                onClick={handleVerifyAddressInBatch}
              >
                Verify Address
              </button>
              <button
                className="p-2 text-amber-600 border border-amber-600 rounded-lg hover:text-white hover:bg-amber-600"
                onClick={handleAddBatchClick}
              >
                Add Address List
              </button>
            </div>
          </div>

          {sanctionPageView == ProviderSanctionViewType.PROVIDER_BATCH_VIEW ? (
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
                            if (!accordionElements.includes(`Batch ${i + 1}`)) {
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
                          hidden: !accordionElements.includes(`Batch ${i + 1}`),
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
          ) : sanctionPageView ==
            ProviderSanctionViewType.VERIFY_ADDRESS_IN_BATCH ? (
            <div className="flex flex-col p-10">
              <div className="flex flex-col gap-y-2">
                <span className="text-black text-[19px] font-poppins">
                  Verify Address Sanction Status in Batch
                </span>
                <div className="p-20 space-y-20 w-[500px] h-[540px] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 items-center justify-center place-self-center">
                  <input
                    placeholder={'Enter Batch ID'}
                    onChange={handleBatchChange}
                    className="flex items-center w-full p-3 bg-white-input text-base font-bold text-black font-poppins text-center rounded-lg placeholder:text-right hover:bg-gray-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  ></input>

                  <input
                    placeholder={'Enter Wallet Address To Verify'}
                    onChange={handleAddressInput}
                    className="flex items-center w-full p-3 bg-white-input text-base font-bold text-black font-poppins text-center rounded-lg placeholder:text-right hover:bg-gray-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  ></input>

                  <button
                    className="w-full h-[50px] text-amber-600 border border-amber-600 rounded-lg hover:text-white hover:bg-amber-600"
                    onClick={handleBatchAddressVerifySubmit}
                  >
                    Submit
                  </button>
                </div>
                {message.status ? (
                  <div className="flex flex-row items-center w-full space-x-2">
                    <span className="text-center text-[16px] font-poppins pt-3">
                      {message.message}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row items-center w-full space-x-2">
                    <span className="text-center text-[16px] font-poppins pt-3">
                      {message.message}
                    </span>
                  </div>
                )}
              </div>
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
      </div>
    </Layout>
  );
};

export default ProviderIndex;
