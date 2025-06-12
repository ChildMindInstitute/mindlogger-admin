import { Box, Skeleton, styled } from '@mui/material';

import { StyledBodySmall, theme, variables } from 'shared/styles';

export const StyledMonth = styled(Box)`
  padding: ${theme.spacing(0, 2, 2.2)};
  min-width: 25%;
`;
export const StyledMonthInside = styled(Box)`
  max-width: 24rem;
  margin: 0 auto;
`;

export const StyledMonthName = styled(StyledBodySmall)`
  letter-spacing: ${variables.font.letterSpacing.xxl};
  text-align: right;
  text-transform: uppercase;
  margin: ${theme.spacing(0, 1, 0.8, 0)};
`;

export const StyledDay = styled(StyledBodySmall)`
  width: 3.2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
`;

export const StyledSkeleton = styled(Skeleton)`
  border-radius: ${variables.borderRadius.xs};
  background-color: ${variables.palette.on_secondary_container_alpha8};
  margin-bottom: ${theme.spacing(1)};
`;
