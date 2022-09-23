import React from 'react';

import ConnectButton from '@components/Button/ConnectButton';
import { useStore } from '@store/store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { store } = useStore();
  const { account } = store;
  return (
    <div className="flex flex-col min-h-screen bg-sidebar-dark min-w-[313px] max-w-[313px] border border-white border-opacity-5 justify-between">
      <div className="flex flex-col">
        <div className="flex w-full justify-center items-center p-4">
          <img
            className="w-[200px] h-[70px]"
            src={'/img/molecule-dark.svg'}
            alt="molecule"
          />
        </div>
        <div
          className="relative flex flex-row items-center h-[70px] w-full px-2 rounded-m hover:bg-opacity-10"
          style={{
            background:
              'linear-gradient(269.63deg, rgba(253, 78, 5, 0.3) 0.25%, rgba(253, 78, 5, 0) 99.68%)',
          }}
        >
          <span className="text-white text-[16px] font-poppins pl-3">
            Sanction List
          </span>
        </div>
      </div>
      {account ? (
        <div className="flex flex-row h-[70px] items-center justify-center p-4">
          <img className="w-[35px] h-[35px]" src={'/img/user.svg'} alt="user" />
          <span className="text-white text-[16px] font-poppins truncate p-4">
            {account}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
