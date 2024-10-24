import { styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledImage = styled('img')({
  borderRadius: variables.borderRadius.md,
  flexShrink: 0,
  height: 56,
  objectFit: 'cover',
  overflow: 'hidden',
  width: 56,
});

export const StyledPreviewContainer = styled('div')({
  border: `${variables.borderWidth.md} solid ${variables.palette.outline_variant}`,
  borderRadius: variables.borderRadius.lg2,
  display: 'flex',
  gap: theme.spacing(2.4),
  maxHeight: 400,
  overflowY: 'auto',
  padding: theme.spacing(4, 3.2),
  placeItems: 'flex-start',
});
