import { styled } from '@mui/system';
import { Button } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

export const StyledAppletSettingsDescription = styled(StyledBodyMedium)`
  margin: ${theme.spacing(4.8, 0, 2.4)};
`;

export const StyledAppletSettingsButton = styled(Button)`
  width: max-content;
  height: 4.8rem;
  padding: ${theme.spacing(0, 2.5)};

  svg {
    fill: ${({ color }) =>
      color === 'error' ? variables.palette.semantic.error : variables.palette.primary};
  }
`;
