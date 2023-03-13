import { styled } from '@mui/system';

import theme from 'shared/styles/theme';
import { StyledTitleBoldMedium } from 'shared/styles/styledComponents';

export const StyledTitle = styled(StyledTitleBoldMedium)`
  margin-bottom: ${theme.spacing(1.6)};
  margin-top: ${theme.spacing(2.4)};
`;
