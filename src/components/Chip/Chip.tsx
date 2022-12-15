import { Svg } from 'components/Svg';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { ChipProps } from './Chip.types';
import { StyledChip, StyledRemoveBtn } from './Chip.styles';

export const Chip = ({ title, onRemove }: ChipProps) => (
  <StyledChip>
    <StyledLabelLarge color={variables.palette.white}>{title}</StyledLabelLarge>
    {onRemove && (
      <StyledRemoveBtn onClick={onRemove}>
        <Svg id="close" width={18} height={18} />
      </StyledRemoveBtn>
    )}
  </StyledChip>
);
