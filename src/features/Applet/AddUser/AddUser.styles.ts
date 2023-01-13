import { styled } from '@mui/system';

import theme from 'styles/theme';
import { StyledTitleBoldMedium } from 'styles/styledComponents/Typography';

export const StyledTitle = styled(StyledTitleBoldMedium)`
  margin-bottom: ${theme.spacing(1.6)};
  margin-top: ${theme.spacing(2.4)};
`;
