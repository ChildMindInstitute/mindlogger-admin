import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

export const StyledButtons = styled(StyledFlexTopCenter)`
  button + button {
    margin-left: ${theme.spacing(2.4)};
  }
`;
