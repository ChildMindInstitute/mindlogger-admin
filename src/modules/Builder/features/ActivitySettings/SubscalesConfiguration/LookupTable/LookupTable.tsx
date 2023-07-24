import { StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';

import { LookupTableProps } from './LookupTable.types';
import { getModalComponents } from './LookupTable.utils';
import { useSubscaleLookupTableSetup } from './LookupTable.hooks';

export const LookupTable = ({
  open,
  labelsObject,
  columnData,
  tableData,
  template,
  templatePrefix = '',
  schema,
  onUpdate,
  onClose,
}: LookupTableProps) => {
  const { step, ...hookProps } = useSubscaleLookupTableSetup({
    errors: labelsObject.errors,
    template,
    templatePrefix,
    tableData,
    schema,
  });

  const screens = getModalComponents({
    ...hookProps,
    columnData,
    labelsObject,
    onUpdate,
    onClose,
  });
  const { component, ...modalProps } = screens[step];

  return (
    <Modal open={open} onClose={onClose} width="93.6" {...modalProps}>
      <StyledModalWrapper>{component}</StyledModalWrapper>
    </Modal>
  );
};
