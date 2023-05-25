import { styled } from '@mui/material';

import { StyledBodyMedium } from 'shared/styles';

export const StyledCellText = styled(StyledBodyMedium)`
  position: absolute;
  left: 0;
  right: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1.2rem;
`;
