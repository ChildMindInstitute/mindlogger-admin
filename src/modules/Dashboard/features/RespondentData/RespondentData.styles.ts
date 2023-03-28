import { Button, styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledMenu = styled(StyledFlexColumn)`
  display: flex;
  flex-direction: column;
  width: 40rem;
  height: 100%;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(4.8, 1.6)};
`;

export const StyledTextBtn = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
