import { Button, styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledMenu = styled(StyledFlexColumn)`
  width: 40rem;
  height: 100%;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(4.8, 1.6)};
  overflow-y: auto;

  ${theme.breakpoints.down('xl')} {
    width: 35rem;
  }
  ${theme.breakpoints.down('lg')} {
    width: 30rem;
  }
`;

export const StyledTextBtn = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledButton = styled(Button)`
  min-width: 10rem;
  padding: ${theme.spacing(0)};
  color: ${variables.palette.on_secondary_container};
`;

export const ActionButton = styled(StyledButton)`
  padding: ${theme.spacing(1.4, 2.4)};
`;
