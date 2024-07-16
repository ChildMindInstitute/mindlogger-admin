import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledRoot = styled(Box)({
  background: variables.palette.primary_container,
  borderRadius: variables.borderRadius.md,
  display: 'flex',
  flexShrink: 0,
  flexWrap: 'wrap',
  height: '8rem',
  overflow: 'hidden',
  placeContent: 'flex-start',
  placeItems: 'flex-start',
  position: 'relative',
  width: '8rem',
});

export const StyledActivityThumbnail = styled('img')({
  background: variables.palette.surface1,
  width: '50%',
  height: '50%',
  position: 'relative',
  objectFit: 'cover',
  border: 'none',
});

export const StyledItemCount = styled(StyledFlexAllCenter)({
  background: variables.palette.primary80,
  borderRadius: '100%',
  color: variables.palette.primary,
  fontSize: variables.font.size.md,
  fontWeight: variables.font.weight.bold,
  height: '3.2rem',
  inset: 0,
  margin: 'auto',
  padding: theme.spacing(0.8, 1.2),
  position: 'absolute',
  width: 'max-content',
});
