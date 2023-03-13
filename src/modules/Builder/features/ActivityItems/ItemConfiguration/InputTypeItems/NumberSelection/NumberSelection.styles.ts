import { styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables, theme } from 'shared/styles';

export const StyledNumberSelectionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledInputWrapper = styled(StyledFlexTopCenter)`
  width: 50%;
`;
