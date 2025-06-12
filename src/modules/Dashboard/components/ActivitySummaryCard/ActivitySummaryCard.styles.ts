import { styled } from '@mui/material';
import { MouseEventHandler } from 'react';

import { StyledFlexSpaceBetween, StyledHeadlineSmall, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexSpaceBetween)(
  ({
    showStats = false,
    onClick = undefined,
  }: {
    showStats?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
  }) => ({
    flexDirection: 'column',
    gap: theme.spacing(3.2),
    padding: theme.spacing(2.4),
    width: '30.6rem',
    height: showStats ? '44rem' : undefined,
    border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
    borderRadius: variables.borderRadius.lg2,
    cursor: onClick ? 'pointer' : 'default',
    transition: variables.transitions.bgColor,

    '&:hover': {
      background: onClick ? variables.palette.on_surface_variant_alpha8 : 'inherit',
    },
  }),
);

export const StyledActivityName = styled(StyledHeadlineSmall)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
`;
