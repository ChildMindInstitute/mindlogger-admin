import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

export const StyledWrapper = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};
`;

export const StyledButtonsTitle = styled(StyledBodyMedium)`
  margin-bottom: ${theme.spacing(1.2)};
`;

export const StyledTimeWrapper = styled(Box)`
  margin-right: ${theme.spacing(2.4)};
`;
