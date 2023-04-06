import { styled } from '@mui/material';

import { StyledFlexAllCenter, variables } from 'shared/styles';

export const StyledEmptyReview = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 40rem;
  text-align: center;

  svg {
    fill: ${variables.palette.outline};
  }
`;
