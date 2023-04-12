import { Switch, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledSwitch = styled(Switch)`
  align-items: center;
  width: 6.4rem;
  .MuiButtonBase-root {
    left: 0.6rem;
    top: 0.1rem;
    .MuiSwitch-thumb {
      color: ${variables.palette.white};
      width: 1.8rem;
      height: 1.8rem;
    }
    &.Mui-checked {
      transform: translateX(1.6rem);
      .MuiSwitch-thumb {
        color: ${variables.palette.white};
      }
      + .MuiSwitch-track {
        background-color: ${variables.palette.primary};
        opacity: 1;
      }
    }
  }
  .MuiSwitch-track {
    width: 4rem;
    height: 2.4rem;
    border-radius: ${variables.borderRadius.xxxl};
    background-color: ${variables.palette.outline};
  }
`;
