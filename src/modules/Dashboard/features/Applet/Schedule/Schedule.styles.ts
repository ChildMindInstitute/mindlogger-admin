import { styled, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';

import { LEFT_SCHEDULE_PANEL_WIDTH } from './Schedule.const';

export const StyledSchedule = styled(Box)`
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
