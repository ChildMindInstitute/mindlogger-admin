import { styled } from '@mui/material';

import { StyledTitleSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledText = styled(StyledTitleSmall)`
  color: ${variables.palette.semantic.error};
  margin: ${theme.spacing(0, 1.6)};
`;
