import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledReview = styled(Box)`
  padding: ${theme.spacing(2.4, 6, 4)};
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
