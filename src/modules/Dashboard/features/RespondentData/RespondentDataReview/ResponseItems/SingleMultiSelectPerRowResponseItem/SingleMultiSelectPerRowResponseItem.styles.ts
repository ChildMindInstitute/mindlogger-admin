import { styled } from '@mui/material';

import { StyledFlexColumn, variables, theme } from 'shared/styles';

export const StyledSelectionBox = styled(StyledFlexColumn)`
  flex: 1 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing(2.4, 1.2)};
  gap: 4.4rem;

  :not(:last-child) {
    border-right: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }

  :last-child {
    padding-right: ${theme.spacing(5.8)};
  }
`;
