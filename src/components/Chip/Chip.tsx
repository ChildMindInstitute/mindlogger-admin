import { Svg } from 'components/Svg';

import { ChipProps, ChipShape } from './Chip.types';
import { StyledChip, StyledClearedButton } from './Chip.styles';

export const Chip = ({
  title,
  color = 'primary',
  shape = ChipShape.rectangular,
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
    onDelete={onRemove}
  />
);
