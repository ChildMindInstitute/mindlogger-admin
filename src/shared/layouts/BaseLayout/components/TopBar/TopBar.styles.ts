import { styled } from '@mui/system';
import { Button } from '@mui/material';

import { TOP_BAR_HEIGHT } from 'shared/consts';
import {
  theme,
  variables,
  StyledClearedButton,
  StyledFlexSpaceBetween,
  StyledQuantityCircle,
} from 'shared/styles';

export const StyledTopBar = styled(StyledFlexSpaceBetween)`
  height: ${TOP_BAR_HEIGHT};
  align-items: center;
  padding: ${theme.spacing(1.4, 2.4, 1.4, 2)};
`;

export const StyledAvatarBtn = styled(StyledClearedButton)`
  border-radius: ${variables.borderRadius.half};
  height: 3rem;
  width: 3rem;
  position: relative;
  background-color: ${variables.palette.primary_container};
`;

export const StyledQuantity = styled(StyledQuantityCircle)`
  top: -0.2rem;
  right: -0.2rem;
  min-width: 1.6rem;
  padding: ${theme.spacing(0.2)};
`;

export const StyledLoginButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
