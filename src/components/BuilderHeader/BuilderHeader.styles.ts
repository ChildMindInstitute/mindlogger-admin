import { styled } from '@mui/system';
import { Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents';

export const StyledBtn = styled(Button)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline};
  border-radius: ${variables.borderRadius.xxxl};
  font-weight: ${variables.font.weight.regular};
  height: 4.8rem;

  svg {
    fill: ${variables.palette.primary};
    margin-right: ${theme.spacing(0.8)};
  }
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(1.6)};
`;
