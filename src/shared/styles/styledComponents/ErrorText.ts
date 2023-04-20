import { styled } from '@mui/system';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

import { StyledLabelMedium } from './Typography';

export const StyledErrorText = styled(StyledLabelMedium)`
  margin-top: ${({ marginTop }: { marginTop?: number }) =>
    marginTop?.toString() ? theme.spacing(marginTop) : theme.spacing(-1.5)};
  margin-bottom: ${theme.spacing(1.2)};
  && {
    color: ${variables.palette.semantic.error};
  }
`;
