import { styled } from '@mui/system';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

export const StyledContainer = styled(StyledFlexTopCenter)`
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

export const StyledHeadline = styled(StyledHeadlineLarge)`
  margin-bottom: ${theme.spacing(5.6)};
`;
