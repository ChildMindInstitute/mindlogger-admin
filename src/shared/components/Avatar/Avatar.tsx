import { StyledLabelBoldLarge, variables, StyledLabelBoldMedium } from 'shared/styles';

import { StyledAvatar } from './Avatar.styles';
import { AvatarProps, AvatarUiType } from './Avatar.types';

export const Avatar = ({ caption, uiType = AvatarUiType.Primary }: AvatarProps) => (
  <StyledAvatar>
    {uiType === AvatarUiType.Primary ? (
      <StyledLabelBoldLarge color={variables.palette.on_surface}>{caption}</StyledLabelBoldLarge>
    ) : (
      <StyledLabelBoldMedium color={variables.palette.on_surface}>{caption}</StyledLabelBoldMedium>
    )}
  </StyledAvatar>
);
