import { styled } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexColumn)`
  width: 54.6rem;
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  position: absolute;
  margin-left: ${theme.spacing(1)};
`;
