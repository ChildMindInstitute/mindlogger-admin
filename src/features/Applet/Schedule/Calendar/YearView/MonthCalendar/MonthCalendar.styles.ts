import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledBodySmall } from 'styles/styledComponents';

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

export const StyledDaysWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledDay = styled(StyledBodySmall)`
  width: 3.2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
`;
