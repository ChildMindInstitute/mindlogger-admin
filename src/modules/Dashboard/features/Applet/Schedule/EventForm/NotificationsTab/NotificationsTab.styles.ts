import { styled, Box, Button } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledRow = styled(Box)`
  margin-top: ${theme.spacing(2.4)};
`;

export const StyledRowHeader = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(1.2)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledAddBtn = styled(Button)`
  width: 17rem;
  margin: ${theme.spacing(0.25, 0)};

  &.MuiButton-text:hover,
  &.MuiButton-text:active {
    background-color: transparent;
  }

  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledNotificationWrapper = styled(Box)`
  border-left: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  margin-left: ${theme.spacing(0.8)};
`;

export const StyledColInner = styled(Box)`
  width: 50%;
`;
