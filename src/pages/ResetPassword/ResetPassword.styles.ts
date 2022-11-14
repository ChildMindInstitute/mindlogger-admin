import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';

export const StyledResetPassword = styled(Box)`
  width: 100%;
`;

export const StyledContainerWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const StyledContainer = styled(Box)`
  width: 37.6rem;
  margin: ${theme.spacing(2.4, 0)};
`;
