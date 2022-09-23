import React, { useCallback, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import clsx from 'clsx';
import { Modal } from 'flowbite-react';

import { ModalEnum, useModal } from '@contexts/modal';
import { useStore } from '@store/store';
import { RegionCodes } from '@type/common';
import { StoreActionTypes } from '@type/store';

const RegionModal = () => {
  const { modal, hideModal } = useModal();
  const { dispatch } = useStore();
  const [selected, setSelected] = useState<number[]>([]);

  const ref = useRef(null);

  useClickAway(ref, () => {
    hideModal();
  });

  const handleSelectRegion = useCallback(
    (regionCode: number) => {
      if (!selected.includes(regionCode)) {
        console.log(!selected.includes(regionCode));
        setSelected([...selected, regionCode]);
      } else {
        setSelected(selected.filter((select) => select !== regionCode));
      }
    },
    [selected]
  );

  const handleSubmit = useCallback(() => {
    dispatch({
      type: StoreActionTypes.SET_REGION_CODE,
      payload: { regionCodes: selected },
    });
    hideModal();
  }, [dispatch, hideModal, selected]);

  return (
    <div>
      <Modal
        show={modal === ModalEnum.REGION_MODAL}
        onClose={hideModal}
        size="4xl"
      >
        <div className="border border-white rounded-md shadow bg-gray-400 border-opacity-5 h-[400px]">
          <div className="grid grid-cols-6 p-2 gap-y-2">
            <div
              className={clsx({
                'relative flex flex-row items-center h-[80px] w-full px-2 rounded hover:bg-opacity-10 hover:bg-gray-200':
                  !selected.includes(RegionCodes.USA),
                'relative flex flex-row border items-center h-[80px] w-full px-2 rounded hover:bg-opacity-10 hover:bg-gray-200':
                  selected.includes(RegionCodes.USA),
              })}
              onClick={() => handleSelectRegion(RegionCodes.USA)}
            >
              <img
                className="w-[80px] h-[60px] rounded"
                src={'/img/US.svg'}
                alt="US"
              />
              <span className="text-white text-[14px] font-poppins pl-2">
                {`USA`}
              </span>
            </div>

            <div
              className={clsx({
                'relative flex flex-row items-center h-[80px] w-full px-2 rounded hover:bg-opacity-10 hover:bg-gray-200':
                  !selected.includes(RegionCodes.UK),
                'relative flex flex-row border items-center h-[80px] w-full px-2 rounded hover:bg-opacity-10 hover:bg-gray-200':
                  selected.includes(RegionCodes.UK),
              })}
              onClick={() => handleSelectRegion(RegionCodes.UK)}
            >
              <img
                className="w-[80px] h-[60px] rounded"
                src={'/img/UK.svg'}
                alt="UK"
              />
              <span className="text-white text-[14px] font-poppins pl-2">
                {`UK`}
              </span>
            </div>
          </div>
          <div className="flex flex-row">
            <button
              className="p-2 text-white border border-white rounded-lg absolute right-[20px] bottom-[20px]"
              onClick={handleSubmit}
            >
              Select Regions
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegionModal;
