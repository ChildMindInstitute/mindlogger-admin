import { styled } from '@mui/system';

import { StyledModalWrapper, StyledTitleSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledApplets = styled(StyledModalWrapper)`
  height: 45rem;
  overflow: auto;
`;

export const StyledError = styled(StyledTitleSmall)`
  color: ${variables.palette.semantic.error};
  margin: ${theme.spacing(2.4, 3.2, 0)};
`;
