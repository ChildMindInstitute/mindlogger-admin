import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledHeader = styled(Box)`
  display: flex;
`;

export const StyledForm = styled('form')`
  margin: ${theme.spacing(0, 6.4, 6.4, 0)};
`;

export const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 54.6rem;
`;

export const StyledButton = styled(StyledClearedButton)`
  justify-content: flex-start;
  width: 20rem;
  color: ${variables.palette.on_surface};
  margin: ${theme.spacing(2.4, 0)};
  svg {
    fill: ${variables.palette.on_surface};
  }
`;
