import { styled } from '@mui/material';

import { StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledRoot = styled(StyledFlexSpaceBetween)({
  border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
  borderRadius: variables.borderRadius.lg2,
  display: 'flex',
  gap: theme.spacing(2.4),
  overflow: 'hidden',
  padding: theme.spacing(2.4),
  placeContent: 'space-between',
  placeItems: 'center',
});
