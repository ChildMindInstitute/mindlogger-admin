import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledReview = styled(Box)`
  width: 100%;
  height: 100%;
  padding: ${theme.spacing(2.4, 6, 4)};
`;

export const StyledEmptyReview = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 40rem;
  text-align: center;

  svg {
    fill: ${variables.palette.outline};
  }
`;
