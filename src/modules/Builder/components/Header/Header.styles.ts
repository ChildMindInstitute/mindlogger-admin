import { styled } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(1.6)};
`;

export const StyledButtons = styled(StyledFlexTopCenter)`
  button + button {
    margin-left: ${theme.spacing(2.4)};
  }
`;
