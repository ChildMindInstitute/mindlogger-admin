import { styled, Button } from '@mui/material';

import { TOP_BAR_HEIGHT } from 'shared/consts';
import { theme, variables, StyledClearedButton, StyledFlexSpaceBetween } from 'shared/styles';

export const StyledTopBar = styled(StyledFlexSpaceBetween)`
  height: ${TOP_BAR_HEIGHT};
  align-items: center;
  padding: ${theme.spacing(1.4, 2.4, 1.4, 2)};
`;

export const StyledAvatarBtn = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  height: 3.2rem;
  width: 3.2rem;
  background-color: ${variables.palette.primary_container};
`;

export const StyledLoginButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
