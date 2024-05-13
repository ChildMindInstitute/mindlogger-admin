import { Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledButton = styled(Button)`
  min-width: 10rem;
  padding: ${theme.spacing(0)};
  color: ${variables.palette.on_secondary_container};
`;

export const ActionButton = styled(StyledButton)`
  padding: ${theme.spacing(1.4, 2.4)};
`;
