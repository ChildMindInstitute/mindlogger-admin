import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledWrapper = styled(Box)`
  display: flex;
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
  padding-left: ${theme.spacing(6.4)};
`;

export const StyledButtonsContainer = styled(StyledFlexTopCenter)`
  gap: 1.2rem;
  margin-top: ${theme.spacing(2.9)};
`;
