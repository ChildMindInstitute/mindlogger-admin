import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { LEFT_SCHEDULE_PANEL_WIDTH } from './Schedule.const';

export const StyledSchedule = styled(Box)`
  margin: ${theme.spacing(-2.4, -2.1, -1.6)};
  display: flex;
  flex-grow: 1;
  height: 100%;
`;

export const StyledLeftPanel = styled(Box)`
  width: ${LEFT_SCHEDULE_PANEL_WIDTH};
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  overflow-y: auto;
  flex-shrink: 0;
`;
