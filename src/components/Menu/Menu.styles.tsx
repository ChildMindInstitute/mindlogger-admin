import { Menu } from '@mui/material';
import { styled } from '@mui/system';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

export const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
    border-radius: ${variables.borderRadius.md};
    box-shadow: unset;
  }
`;

export const StyledDotsBtn = styled(StyledClearedButton)`
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
`;

export const StyledTitle = styled(StyledLabelMedium)`
  padding: 0.6rem 1.6rem;
`;
