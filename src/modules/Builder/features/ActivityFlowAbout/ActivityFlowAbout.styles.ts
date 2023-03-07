import { styled } from '@mui/system';

import { Svg } from 'shared/components';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledForm = styled('form')`
  width: 55rem;
`;

export const StyledSvg = styled(Svg)`
  position: absolute;
  margin-left: ${theme.spacing(1)};
  fill: ${variables.palette.outline};
`;
