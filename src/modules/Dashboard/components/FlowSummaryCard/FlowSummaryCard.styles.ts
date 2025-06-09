import { styled } from '@mui/material';
import { MouseEventHandler } from 'react';

import { StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledRoot = styled(StyledFlexSpaceBetween)(
  ({ onClick = undefined }: { onClick?: MouseEventHandler<HTMLDivElement> }) => ({
    border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
    borderRadius: variables.borderRadius.lg2,
    display: 'flex',
    gap: theme.spacing(2.4),
    overflow: 'hidden',
    padding: theme.spacing(2.4),
    placeContent: 'space-between',
    placeItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
    transition: variables.transitions.bgColor,

    '&:hover': {
      background: onClick ? variables.palette.on_surface_variant_alpha8 : 'inherit',
    },
  }),
);
