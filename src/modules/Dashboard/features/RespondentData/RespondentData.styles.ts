import { Button, styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledMenu = styled(StyledFlexColumn)`
  width: 40rem;
  height: 100%;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(2.4, 1.6)};
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

  &&.Mui-disabled {
    color: ${variables.palette.disabled};

    svg {
      fill: ${variables.palette.disabled};
    }
  }
`;
