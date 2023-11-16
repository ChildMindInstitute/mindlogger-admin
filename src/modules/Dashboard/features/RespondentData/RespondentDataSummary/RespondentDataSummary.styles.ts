import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, variables } from 'shared/styles';

export const StyledReportContainer = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: auto;

  .spinner-container {
    width: calc(100% - 40rem);
  }
`;

export const StyledEmptyReview = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 40rem;
  height: 100%;
  text-align: center;

  svg {
    fill: ${variables.palette.outline};
  }
`;
