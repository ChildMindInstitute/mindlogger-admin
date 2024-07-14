import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledLineBreak = styled(Box)({
  borderTop: `1px dashed ${variables.palette.outline_variant2}`,
  width: '100%',
  margin: theme.spacing(0, 1.6),
});
