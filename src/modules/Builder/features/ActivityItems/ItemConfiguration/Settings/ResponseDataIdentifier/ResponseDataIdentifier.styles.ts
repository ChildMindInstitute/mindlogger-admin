import { styled } from '@mui/material';

import { theme, variables, StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles';

export const StyledResponseDataIdentifierContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledResponseDataIdentifierHeader = styled(StyledFlexTopCenter)`
  width: 100%;
  justify-content: space-between;
  padding: ${theme.spacing(0.4, 0)};
  margin-bottom: ${theme.spacing(1)};
`;
