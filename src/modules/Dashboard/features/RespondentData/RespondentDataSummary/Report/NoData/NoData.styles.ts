import { styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledEmptyState = styled(StyledFlexColumn)`
  align-items: center;
  margin-top: ${theme.spacing(18)};

  svg {
    fill: ${variables.palette.outline};
  }
`;
