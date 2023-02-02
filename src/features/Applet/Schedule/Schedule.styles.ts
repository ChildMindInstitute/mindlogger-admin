import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledSchedule = styled(Box)`
  margin: ${theme.spacing(-2.4, -2.1, -1.6)};
  display: flex;
  flex-grow: 1;
  height: 100%;
`;

export const StyledLeftPanel = styled(Box)`
  width: 32rem;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  overflow-y: scroll;
`;
