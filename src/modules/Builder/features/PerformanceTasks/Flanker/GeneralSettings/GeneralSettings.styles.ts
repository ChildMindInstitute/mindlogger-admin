import { Button, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledAddButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
