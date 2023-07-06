import { styled } from '@mui/material';

import { StyledFlexAllCenter, variables } from 'shared/styles';

export const StyledReportContainer = styled(StyledFlexAllCenter)`
  position: relative;
  width: calc(100% - 40rem);
  height: 100%;
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
