import { styled } from '@mui/material';

import { theme } from 'shared/styles';
import { variables } from 'shared/styles/variables';

export const StyledInput = styled('input')({
  background: 'transparent',
  border: 'none',
  color: variables.palette.black,
  fontSize: variables.font.size.lg,
  fontWeight: variables.font.weight.regular,
  height: theme.spacing(5.6),
  padding: theme.spacing(1.6),
  width: '100%',
});

export const StyledLinkLabel = styled('label')({
  background: variables.palette.inverse_on_surface,
  color: variables.palette.on_surface_variant,
  display: 'flex',
  fontSize: variables.font.size.lg,
  fontWeight: variables.font.weight.regular,
  gap: theme.spacing(1.6),
  height: theme.spacing(5.6),
  padding: theme.spacing(1.6),
  placeItems: 'center',
  width: '100%',
});
