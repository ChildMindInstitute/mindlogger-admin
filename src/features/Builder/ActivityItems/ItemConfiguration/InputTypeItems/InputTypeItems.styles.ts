import { Button, styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledItemOptionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledColumn = styled(StyledFlexColumn)`
  justify-content: flex-start;
`;

export const StyledResponseButton = styled(Button)`
  border-radius: ${variables.borderRadius.xxxl};
  font-weight: ${variables.font.weight.bold};
  height: 4.8rem;

  &&.Mui-disabled {
    background-color: ${variables.palette.on_surface_alfa12};
  }

  svg {
    fill: ${variables.palette.on_surface_alfa38};
  }
`;

export const StyledInputWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
`;
