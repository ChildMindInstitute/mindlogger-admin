import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledRoot = styled(Box)({
  border: `1px solid ${variables.palette.surface_variant}`,
  borderRadius: '1.6rem',
  display: 'flex',
  gap: theme.spacing(2.4),
  overflow: 'hidden',
  padding: theme.spacing(2.4),
  placeContent: 'space-between',
  placeItems: 'center',
});
