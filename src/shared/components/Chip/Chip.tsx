import { Svg } from 'shared/components/Svg';

import { ChipProps, ChipShape } from './Chip.types';
import { StyledChip, StyledClearedButton } from './Chip.styles';

export const Chip = ({
  shape = ChipShape.Rounded,
  title,
  onRemove,
  canRemove = true,
  'data-testid': dataTestid,
  ...otherProps
}: ChipProps) => (
  <StyledChip
    shape={shape}
    deleteIcon={
      canRemove ? (
        <StyledClearedButton data-testid={`${dataTestid || 'chip'}-close-button`}>
          <Svg id="close" width={18} height={18} />
        </StyledClearedButton>
      ) : undefined
    }
    label={title}
    onDelete={onRemove}
    data-testid={dataTestid}
    {...otherProps}
  />
);
