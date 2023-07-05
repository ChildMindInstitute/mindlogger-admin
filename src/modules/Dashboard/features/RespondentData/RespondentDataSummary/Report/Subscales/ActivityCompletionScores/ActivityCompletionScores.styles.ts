import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { StyledFlexTopStart, theme } from 'shared/styles';

export const StyledDescription = styled(StyledFlexTopStart)`
  margin: ${theme.spacing(0.8, 0, 2.4)};
`;

export const StyledChartContainer = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};
  height: 45rem;
`;
