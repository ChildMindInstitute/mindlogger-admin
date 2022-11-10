import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { StyledSmallText } from './Typography';

export const StyledErrorText = styled(StyledSmallText)`
  margin-top: ${theme.spacing(-2.4)};
  margin-bottom: ${theme.spacing(1.2)};
  color: ${variables.palette.semantic.error};
`;
