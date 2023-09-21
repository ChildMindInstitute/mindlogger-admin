import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, variables } from 'shared/styles';

export const StyledReviewContainer = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
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

export const StyledWrapper = styled(StyledFlexAllCenter)`
  height: calc(100% - 9.6rem);
`;
