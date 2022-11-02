import { styled } from '@mui/system';

import { variables } from 'styles/variables';
import { StyledSmallText } from './Typography';

export const StyledErrorText = styled(StyledSmallText)`
  margin-top: -1.5rem;
  margin-bottom: 0.75rem;
  color: ${variables.palette.semantic.error};
`;
