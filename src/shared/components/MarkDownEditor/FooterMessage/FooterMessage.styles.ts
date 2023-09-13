import { styled } from '@mui/system';

import { StyledTitleSmall } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';

export const StyledText = styled(StyledTitleSmall)`
  color: ${variables.palette.semantic.error};
  margin: ${theme.spacing(0, 1.6)};
`;
