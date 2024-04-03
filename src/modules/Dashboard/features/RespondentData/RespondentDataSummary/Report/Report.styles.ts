import { Box, styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledReport = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 90rem;
`;

export const StyledEmptyState = styled(StyledFlexColumn)`
  align-items: center;
  margin-top: ${theme.spacing(18)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
