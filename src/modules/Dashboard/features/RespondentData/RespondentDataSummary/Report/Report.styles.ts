import { Box, styled } from '@mui/material';

import { StyledFlexColumn, StyledStickyHeader, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledReport = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 90rem;
`;

export const StyledHeader = styled(StyledStickyHeader, shouldForwardProp)`
  justify-content: space-between;
`;

export const StyledEmptyState = styled(StyledFlexColumn)`
  align-items: center;
  margin-top: ${theme.spacing(18)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
