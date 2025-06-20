import { Button, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledButton = styled(Button)`
  position: absolute;
  right: 2.4rem;
  top: 0.5rem;
  z-index: ${theme.zIndex.drawer};
`;
