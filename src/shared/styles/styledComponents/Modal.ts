import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';

import { StyledFlexColumn } from './Flex';

export const StyledModalWrapper = styled(Box)`
  padding: ${theme.spacing(2.4, 3.2)};
`;

export const StyledModalContent = styled(StyledFlexColumn)`
  overflow-y: auto;
  flex-grow: 1;
  position: relative;
`;
