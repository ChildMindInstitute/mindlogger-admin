import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { useSubscaleLookupTableSetup } from './LookupTable.hooks';
import { LookupTableProps } from './LookupTable.types';
import { getModalComponents } from './LookupTable.utils';

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
  'data-testid': dataTestid,
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
    <Modal open={open} onClose={onClose} width="93.6" {...modalProps} data-testid={dataTestid}>
      <StyledModalWrapper>{component}</StyledModalWrapper>
    </Modal>
  );
};
