import { styled } from '@mui/system';
import { Button } from '@mui/material';

import { variables } from 'styles/variables';
import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';

export const StyledColumn = styled(StyledFlexColumn)`
  justify-content: flex-start;
`;
export const StyledButton = styled(Button)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline};
  border-radius: ${variables.borderRadius.xxxl};
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
