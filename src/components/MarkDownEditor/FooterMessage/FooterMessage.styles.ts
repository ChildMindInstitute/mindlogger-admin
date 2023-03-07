import { styled } from '@mui/system';

import { StyledTitleSmall } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledText = styled(StyledTitleSmall)`
  color: ${variables.palette.red};
  margin: 0 ${theme.spacing(1)};
`;
