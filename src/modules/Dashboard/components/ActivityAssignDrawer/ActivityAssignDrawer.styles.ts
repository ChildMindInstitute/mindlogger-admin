import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledActivityAssignHeader = styled(StyledFlexTopCenter)({
  padding: theme.spacing(3.2, 2.4, 2.2, 4),
  borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
});
