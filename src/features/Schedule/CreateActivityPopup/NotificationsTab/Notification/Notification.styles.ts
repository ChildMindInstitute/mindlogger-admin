import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledNotification = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${theme.spacing(3, 3, 2.4, 1.6)};
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
  position: relative;
`;

export const StyledLogo = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(3.5)};
`;

export const StyledTimePickerContainer = styled(Box)`
  display: flex;
  flex-grow: 1;
  margin-left: ${theme.spacing(2.4)};

  > .MuiBox-root:first-of-type {
    margin-right: ${theme.spacing(2.4)};
  }
`;

export const StyledClose = styled(StyledClearedButton)`
  position: absolute;
  top: 3.4rem;
  right: 3.4rem;
`;
