import { styled } from '@mui/system';

import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledHeader = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3.5)};
`;
