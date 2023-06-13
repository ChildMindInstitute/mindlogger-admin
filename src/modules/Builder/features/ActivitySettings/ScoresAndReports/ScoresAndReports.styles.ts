import { Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledButton = styled(Button)`
  width: 19.6rem;
  margin: ${theme.spacing(2.4, 0)};
  padding: ${theme.spacing(1.6)};
`;

export const StyledConfigureBtn = styled(Button)`
  font-size: ${variables.font.size.lg};
`;
