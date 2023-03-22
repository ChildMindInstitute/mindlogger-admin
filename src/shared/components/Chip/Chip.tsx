import { Svg } from 'shared/components/Svg';

import { ChipProps, ChipShape } from './Chip.types';
import { StyledChip, StyledClearedButton } from './Chip.styles';

export const Chip = ({
  title,
  icon,
  color = 'primary',
  shape = ChipShape.Rectangular,
  onRemove,
}: ChipProps) => (
  <StyledChip
    shape={shape}
    color={color}
    deleteIcon={
      <StyledClearedButton>
        <Svg id="close" width={18} height={18} />
      </StyledClearedButton>
    }
    label={title}
    icon={icon || undefined}
    onDelete={onRemove}
  />
);
