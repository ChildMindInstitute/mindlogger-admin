import { styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexColumn)`
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(2.4)};
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
`;
