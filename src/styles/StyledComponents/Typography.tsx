import { styled } from '@mui/system';
import { Typography } from '@mui/material';

import { variables } from 'styles/variables';

interface StyledProps {
  withDecoration?: boolean;
  color?: string;
}

export const StyledLargeTitle = styled(Typography)`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.533rem;
`;

export const StyledMediumTitle = styled(Typography)`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.1875rem;
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
`;

export const StyledSmallTitle = styled(Typography)`
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: ${variables.palette.primary50};
`;

export const StyledSmallText = styled(Typography)`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  color: ${({ color }: StyledProps) => color || variables.palette.shades100};
  text-decoration: ${({ withDecoration }: StyledProps) => (withDecoration ? 'underline' : 'none')};
`;
