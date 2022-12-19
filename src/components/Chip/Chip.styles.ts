import { styled } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledChip = styled(StyledFlexTopCenter)`
  padding: ${theme.spacing(0.6, 1.2)};
  justify-content: space-between;
  border-radius: ${variables.borderRadius.xxl};
  margin: ${theme.spacing(0.8, 0.8, 0, 0)};
  border: solid ${variables.borderWidth.md} ${variables.palette.outline};
`;

export const StyledRemoveBtn = styled(StyledClearedButton)`
  margin-left: ${theme.spacing(0.7)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
