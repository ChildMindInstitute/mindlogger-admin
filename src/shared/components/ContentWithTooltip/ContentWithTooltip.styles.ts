import { styled } from '@mui/material';

import { StyledBodyMedium } from 'shared/styles';

export const StyledCellText = styled(StyledBodyMedium)`
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
