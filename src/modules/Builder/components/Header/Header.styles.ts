import { styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(1.6)};
`;

export const StyledButtons = styled(StyledFlexTopCenter)`
  button + button {
    margin-left: ${theme.spacing(2.4)};
  }
`;
