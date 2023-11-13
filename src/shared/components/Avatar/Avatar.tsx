import {
  StyledLabelBoldLarge,
  variables,
  StyledLabelBoldMedium,
  StyledFlexAllCenter,
} from 'shared/styles';

import { AvatarProps, AvatarUiType } from './Avatar.types';

export const Avatar = ({ caption, uiType = AvatarUiType.Primary }: AvatarProps) => (
  <StyledFlexAllCenter>
    {uiType === AvatarUiType.Primary ? (
      <StyledLabelBoldLarge color={variables.palette.on_surface}>{caption}</StyledLabelBoldLarge>
    ) : (
      <StyledLabelBoldMedium color={variables.palette.on_surface}>{caption}</StyledLabelBoldMedium>
    )}
  </StyledFlexAllCenter>
);
