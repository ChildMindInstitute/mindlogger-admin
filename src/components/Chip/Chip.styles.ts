import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledChip = styled(Box)`
  padding: ${theme.spacing(0.6, 1.2)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${variables.palette.contained_btn_focus};
  border-radius: ${variables.borderRadius.xxl};
  margin: ${theme.spacing(0.8, 0.8, 0, 0)};
`;

export const StyledRemoveBtn = styled(StyledClearedButton)`
  margin-left: ${theme.spacing(0.7)};

  svg {
    fill: ${variables.palette.white};
  }
`;
