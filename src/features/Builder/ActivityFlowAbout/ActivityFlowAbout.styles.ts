import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { Svg } from 'components';
import theme from 'styles/theme';

export const StyledForm = styled('form')`
  width: 55rem;
`;

export const StyledSettings = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const StyledSvg = styled(Svg)`
  position: absolute;
  margin-left: ${theme.spacing(1)};
`;
