import { MenuItem, styled, TextField } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, variables, theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { SelectUiType } from './SelectController.types';

export const StyledTextField = styled(TextField)`
  && {
    .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input {
      padding-right: 4rem;
    }
  }

  .MuiSelect-select .icon-wrapper {
    display: none;
  }

  .MuiSelect-icon {
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    fill: ${variables.palette.on_surface_variant};

    &.MuiSelect-iconOpen {
      transform: translateY(-50%) rotate(180deg);
    }
  }
`;

export const StyledPlaceholder = styled(StyledBodyLarge)`
  position: absolute;
  left: 1.65rem;
  top: 1.6rem;
  color: ${variables.palette.outline};
  white-space: nowrap;
`;

export const StyledPlaceholderMask = styled(StyledBodyLarge)`
  white-space: nowrap;
  margin-right: 5rem;
  height: 0rem;
  opacity: 0;
`;

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  flex: 1;
  ${({ itemDisabled, selectDisabled }: { itemDisabled: boolean; selectDisabled?: boolean }) => {
    if (itemDisabled) {
      return `
        pointer-events: none;
        opacity: ${variables.opacity.disabled};
      `;
    }
    if (selectDisabled) {
      return `
        svg {
          opacity: ${variables.opacity.disabled};
        }
      `;
    }
  }}
`;

export const StyledMenuItem = styled(MenuItem, shouldForwardProp)`
  ${({ uiType }: { uiType: SelectUiType; itemDisabled?: boolean }) =>
    uiType === SelectUiType.Secondary &&
    `
    && {
      padding: ${theme.spacing(1, 1.6)};
    }
  `}

  ${({ itemDisabled }) =>
    itemDisabled &&
    `
    pointer-events: none;
  `}
`;

export const selectDropdownStyles = {
  '.hidden-menu-item': {
    display: 'none',
  },
};
