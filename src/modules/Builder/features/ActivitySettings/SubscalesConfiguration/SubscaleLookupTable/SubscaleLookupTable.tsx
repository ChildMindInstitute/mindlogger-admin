import { StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';

import { SubscaleLookupTableProps } from './SubscaleLookupTable.types';
import { getComponents } from './SubscaleLookupTable.utils';
import { useSubscaleLookupTableSetup } from './SubscaleLookupTable.hooks';

export const SubscaleLookupTable = ({
  open,
  subscaleName,
  tableData,
  onUpdate,
  onClose,
}: SubscaleLookupTableProps) => {
  const { modalType, step, data, error, setModalType, setError, setStep, onFileReady } =
    useSubscaleLookupTableSetup({ tableData });

  if (modalType === null) return null;

  const screens = getComponents({
    modalType,
    subscaleName,
    data,
    error,
    onFileReady,
    onUpdate,
    onClose,
    setModalType,
    setStep,
    setError,
  });
  const { component, ...modalProps } = screens[step];

  return (
    <Modal open={open} onClose={onClose} width="66" {...modalProps}>
      <StyledModalWrapper>{component}</StyledModalWrapper>
    </Modal>
  );
};
