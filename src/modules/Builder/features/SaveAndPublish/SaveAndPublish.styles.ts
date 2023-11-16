import { Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledButton = styled(Button)`
  position: absolute;
  right: 2.4rem;
  top: 0.5rem;
  z-index: ${theme.zIndex.drawer};

  &&:focus:not(:hover) {
    background-color: ${variables.palette.primary};
  }
`;
