import { styled } from '@mui/system';

import { StyledFlexColumn, variables } from 'shared/styles';
import theme from 'shared/styles/theme';

export const StyledItemOptionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;
