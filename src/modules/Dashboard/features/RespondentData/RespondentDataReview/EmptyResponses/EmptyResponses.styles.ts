import { styled } from '@mui/material';

import { variables, StyledFlexAllCenter } from 'shared/styles';

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
