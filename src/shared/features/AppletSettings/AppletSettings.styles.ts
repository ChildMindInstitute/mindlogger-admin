import { styled } from '@mui/system';
import { Button } from '@mui/material';

import {
  StyledHeadlineLarge,
  StyledFlexTopCenter,
  StyledBodyMedium,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledContainer = styled(StyledFlexTopCenter)`
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

export const StyledHeadline = styled(StyledHeadlineLarge)`
  margin-bottom: ${theme.spacing(5.6)};
`;

export const StyledAppletSettingsDescription = styled(StyledBodyMedium)`
  margin: ${theme.spacing(4.8, 0, 2.4)};
`;

export const StyledAppletSettingsButton = styled(Button)`
  width: max-content;
  height: 4.8rem;
  padding: ${theme.spacing(0, 2.5)};

  :disabled {
    svg {
      fill: ${variables.palette.contained_btn_disabled_text};
    }
  }

  svg {
    fill: ${({ color }) =>
      color === 'error' ? variables.palette.semantic.error : variables.palette.primary};
  }
`;
