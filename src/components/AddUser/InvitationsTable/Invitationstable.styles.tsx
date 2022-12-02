import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledTitleMedium } from 'styles/styledComponents/Typography';

export const StyledTitle = styled(StyledTitleMedium)`
  margin-top: ${theme.spacing(2.4)};
  margin-bottom: ${theme.spacing(1.6)};
  font-weight: ${variables.font.weight.semiBold};
`;
