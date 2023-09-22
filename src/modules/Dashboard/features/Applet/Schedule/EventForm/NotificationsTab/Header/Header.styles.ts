import { styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

export const StyledHeader = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3.5)};
`;
