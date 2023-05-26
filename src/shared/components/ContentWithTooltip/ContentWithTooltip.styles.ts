import { styled } from '@mui/material';

import { StyledBodyMedium, theme } from 'shared/styles';

export const StyledCellText = styled(StyledBodyMedium)`
  position: absolute;
  left: 0;
  right: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 ${theme.spacing(1.2)};
`;
