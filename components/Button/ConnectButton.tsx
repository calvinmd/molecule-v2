import React from 'react';

import { ModalEnum, useModal } from '@contexts/modal';
import { useWallet } from '@contexts/wallet';

interface ConnectButtonProps {} // eslint-disable-line

const ConnectButton: React.FC<ConnectButtonProps> = () => {
  const { connected, disconnect } = useWallet();
  const { setModal } = useModal();

  const handleConnect = () => {
    if (!connected) setModal(ModalEnum.CONNECT_MODAL);
    if (connected) disconnect();
  };

  return (
    <button
      onClick={handleConnect}
      type="button"
      className="flex flex-row items-center justify-center px-6 py-2 mr-8 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-green-800"
    >
      {!connected ? 'Connect Wallet' : 'Disconnect'}
    </button>
  );
};

export default ConnectButton;
