import { StyledModalWrapper } from 'shared/styles';
import { Modal, SubmitBtnColor } from 'shared/components';

import { SubscaleLookupTableProps } from './SubscaleLookupTable.types';
import { getComponent } from './SubscaleLookupTable.utils';
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

  const screens = getComponent({
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={screens[step].onSubmit}
      title={screens[step].title}
      buttonText={screens[step].btnText}
      hasSecondBtn={screens[step].hasSecondBtn}
      secondBtnText={screens[step].secondBtnText}
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
      onSecondBtnSubmit={screens[step].onSecondBtnSubmit}
      hasThirdBtn={screens[step].hasThirdBtn}
      thirdBtnText={screens[step].thirdBtnText}
      onThirdBtnSubmit={screens[step].onThirdBtnSubmit}
      width="66"
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
