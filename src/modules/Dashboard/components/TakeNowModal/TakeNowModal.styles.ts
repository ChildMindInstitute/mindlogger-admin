import { Box, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledTakeNowModalContent = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: ${theme.spacing(2.4, 3.2)};
`;

export const StyledTakeNowModalHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

export const StyledTakeNowModalBody = styled(Box)``;

export const StyledTakeNowModalRow = styled(Box)`
  display: flex;
  gap: 0.4rem;
`;
