import { styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledEmptyContainer = styled(StyledFlexAllCenter)`
  width: 100%;
  height: 100%;
  margin-top: ${theme.spacing(9.6)};
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
