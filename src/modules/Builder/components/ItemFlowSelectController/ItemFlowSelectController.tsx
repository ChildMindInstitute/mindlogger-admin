import { Control, FieldValues } from 'react-hook-form';
import { useRef, useState } from 'react';

import { Tooltip } from 'shared/components';

import { StyledMdPreview, StyledSelectController } from './ItemFlowSelectController.styles';
import { ItemFlowSelectControllerProps } from './ItemFlowSelectController.types';

export const ItemFlowSelectController = ({
  control,
  SelectProps,
  tooltipTitle,
  ...otherProps
}: ItemFlowSelectControllerProps) => {
  const [open, setOpen] = useState(false);
  const selectIsOpen = useRef(false);

  const handleCloseSelect = (e: React.SyntheticEvent) => {
    selectIsOpen.current = false;

    SelectProps?.onClose?.(e);
  };

  const handleOpenSelect = (e: React.SyntheticEvent) => {
    selectIsOpen.current = true;
    setOpen(false);

    SelectProps?.onOpen?.(e);
  };

  const handleCloseTooltip = () => {
    setOpen(false);
  };

  const handleOpenTooltip = () => {
    if (!selectIsOpen.current) {
      setOpen(true);
    }
  };

  return (
    <Tooltip
      enterNextDelay={500}
      onClose={handleCloseTooltip}
      onOpen={handleOpenTooltip}
      open={open}
      tooltipTitle={tooltipTitle ? <StyledMdPreview modelValue={tooltipTitle} /> : undefined}
    >
      <span>
        <StyledSelectController
          control={control as Control<FieldValues> | undefined}
          isLabelNeedTranslation={false}
          SelectProps={{ ...SelectProps, onClose: handleCloseSelect, onOpen: handleOpenSelect }}
          {...otherProps}
        />
      </span>
    </Tooltip>
  );
};
