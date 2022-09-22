import React, { createContext, useCallback, useContext, useState } from 'react';

import RegionModal from '@components/Modal/RegionModal';
import WalletModal from '@components/Modal/WalletModal';

export enum ModalEnum {
  CONNECT_MODAL = 'connect-modal',
  WALLET_MODAL = 'wallet-modal',
  REGION_MODAL = 'region-modal',
}

export interface ModalContextProps {
  modal: ModalEnum | null;
  setModal: (modal: ModalEnum) => void;
  hideModal: () => void;
}

const defaultContext: ModalContextProps = {
  modal: null,
  setModal: () => null,
  hideModal: () => null,
};

export const ModalContext = createContext<ModalContextProps>(defaultContext);

export const ModalProvider: React.FC = ({ children }) => {
  const [modal, setModal] = useState(defaultContext.modal);

  const hideModal = useCallback(() => setModal(null), [setModal]);

  return (
    <ModalContext.Provider
      value={{
        ...defaultContext,
        modal,
        setModal,
        hideModal,
      }}
    >
      {children}
      {modal == ModalEnum.CONNECT_MODAL && <WalletModal />}
      {modal == ModalEnum.REGION_MODAL && <RegionModal />}
      {}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
