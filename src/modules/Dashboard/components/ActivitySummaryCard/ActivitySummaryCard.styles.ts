import { styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexSpaceBetween,
  StyledHeadline,
  theme,
  variables,
} from 'shared/styles';

export const StyledContainer = styled(StyledFlexSpaceBetween)(
  ({ showStats = false }: { showStats?: boolean }) => ({
    flexDirection: 'column',
    gap: theme.spacing(3.2),
    padding: theme.spacing(2.4),
    width: '30.6rem',
    height: showStats ? '44rem' : undefined,
    border: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
    borderRadius: variables.borderRadius.lg2,
  }),
);

export const StyledActivityName = styled(StyledHeadline)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
`;
