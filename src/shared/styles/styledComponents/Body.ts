import { styled } from '@mui/material';

import { StyledFlexColumn } from './Flex';

export const StyledBody = styled(StyledFlexColumn)`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
`;
