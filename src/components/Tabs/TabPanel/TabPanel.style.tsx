import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledPanel = styled(Box)`
  background: ${variables.palette.shadesBG};
  padding: ${theme.spacing(2.4, 2.4, 3.5)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.shades70};
`;
