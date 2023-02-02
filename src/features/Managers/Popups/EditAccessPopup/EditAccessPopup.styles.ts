import { styled } from '@mui/system';

import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledApplets = styled(StyledModalWrapper)`
  height: 45rem;
  overflow: auto;
`;

export const StyledError = styled(StyledTitleSmall)`
  color: ${variables.palette.semantic.error};
  margin: ${theme.spacing(2.4, 3.2, 0)};
`;
