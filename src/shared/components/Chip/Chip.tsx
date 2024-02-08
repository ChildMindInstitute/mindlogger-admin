import { Svg } from 'shared/components/Svg';

import { StyledChip, StyledClearedButton } from './Chip.styles';
import { ChipProps, ChipShape } from './Chip.types';

export const Chip = ({
  title,
  icon,
  color = 'primary',
  shape = ChipShape.Rectangular,
  onRemove,
  canRemove = true,
  onClick,
  sxProps,
  'data-testid': dataTestid,
}: ChipProps) => (
  <StyledChip
    shape={shape}
    color={color}
    deleteIcon={
      canRemove ? (
        <StyledClearedButton data-testid={`${dataTestid || 'chip'}-close-button`}>
          <Svg id="close" width={18} height={18} />
        </StyledClearedButton>
      ) : undefined
    }
    label={title}
    icon={icon || undefined}
    onDelete={onRemove}
    onClick={onClick}
    sx={sxProps}
    data-testid={dataTestid}
  />
);
