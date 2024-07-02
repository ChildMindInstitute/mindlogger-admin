import { styled } from '@mui/material';

import { StyledFlexColumn, theme } from 'shared/styles';

export const StyledRoot = styled(StyledFlexColumn)({
  gap: theme.spacing(4.8),
  minHeight: '100%',
  overflow: 'auto',
  position: 'relative',
  padding: theme.spacing(4, 3.2),
});
