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
  const { step, ...hookProps } = useSubscaleLookupTableSetup({ tableData });

  const screens = getComponents({
    ...hookProps,
    subscaleName,
    onUpdate,
    onClose,
  });
  const { component, ...modalProps } = screens[step];

  return (
    <Modal open={open} onClose={onClose} width="66" {...modalProps}>
      <StyledModalWrapper>{component}</StyledModalWrapper>
    </Modal>
  );
};
