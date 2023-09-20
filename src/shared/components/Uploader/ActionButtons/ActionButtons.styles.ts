import { Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { absolutePosition } from '../Uploader.styles';

export const StyledButtonGroup = styled(ButtonGroup, shouldForwardProp)`
  ${absolutePosition}
  .MuiButtonGroup-grouped {
    &:not(:first-of-type) {
      border-left: transparent;
    }

    &:not(:last-of-type):hover {
      border-right-color: transparent;
    }

    .MuiButton-startIcon {
      margin-right: 0;
      margin-left: ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) => !isPrimaryUiType && 0};
    }
  }

  .MuiButton-root.MuiButton-outlined {
    background-color: ${variables.palette.white};
    border-color: ${variables.palette.surface_variant};

    &:hover {
      background-color: ${variables.palette.white};
    }
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledActionBtn = styled(Button, shouldForwardProp)`
  transition: ${variables.transitions.bgColor};

  &:hover {
    && {
      background-color: ${variables.palette.surface};
    }
  }

  ${({ isPrimaryUiType }: { isPrimaryUiType: boolean }) =>
    !isPrimaryUiType &&
    `
        padding: 0;
        width: 4.8rem;
        height: 4.8rem;
    
        && svg {
          fill: ${variables.palette.on_surface_variant};
        }
    `};
`;
