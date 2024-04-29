import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledRoot = styled(Box)({
  background: variables.palette.primary_container,
  borderRadius: 8,
  display: 'flex',
  flexShrink: 0,
  flexWrap: 'wrap',
  height: theme.spacing(8),
  overflow: 'hidden',
  placeContent: 'flex-start',
  placeItems: 'flex-start',
  position: 'relative',
  width: theme.spacing(8),
});

export const StyledActivityThumbnail = styled('img')({
  background: variables.palette.surface1,
  width: '50%',
  height: '50%',
  position: 'relative',
  objectFit: 'cover',
  border: 'none',
});

export const StyledItemCount = styled('div')({
  background: variables.palette.primary80,
  borderRadius: '100%',
  color: variables.palette.primary,
  display: 'flex',
  fontSize: variables.font.size.md,
  fontWeight: variables.font.weight.bold,
  height: '3.2rem',
  inset: 0,
  margin: 'auto',
  padding: `${theme.spacing(0.8)} ${theme.spacing(1.2)}`,
  placeContent: 'center',
  placeItems: 'center',
  position: 'absolute',
  width: 'max-content',
});
