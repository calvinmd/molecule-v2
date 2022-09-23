/* eslint-disable @next/next/link-passhref */
import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import clsx from 'clsx';

import Layout from '@components/Layout/Layout';
import Sidebar from '@components/Layout/Sidebar';
import { SanctionType } from '@type/common';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div
        className={clsx({
          'container w-full h-full': true,
          // 'bg-gray-100': true,
        })}
      >
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
