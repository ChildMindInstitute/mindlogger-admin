import { MenuItem, styled, TextField } from '@mui/material';

import { StyledBodyLarge, variables, theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { SelectUiType, StyledMenuItemProps } from './SelectController.types';

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

export const StyledItem = styled('li')(
  ({ itemDisabled, selectDisabled }: { itemDisabled?: boolean; selectDisabled?: boolean }) => ({
    flex: 1,
    alignItems: 'center',
    display: 'flex',

    '&.MuiButtonBase-root.MuiMenuItem-root.Mui-disabled': {
      opacity: variables.opacity.disabled,
      pointerEvents: 'none',
    },

    ...(itemDisabled && {
      opacity: variables.opacity.disabled,
      pointerEvents: 'none',
    }),

    ...(selectDisabled && {
      '& svg': { opacity: variables.opacity.disabled },
    }),
  }),
);

export const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop: string) => {
    if (['component', 'tooltip', 'tooltipPlacement', 'itemDisabled'].includes(prop)) {
      return true;
    }

    return shouldForwardProp.shouldForwardProp(prop);
  },
})<StyledMenuItemProps>(({ uiType, itemDisabled }) => ({
  ...(uiType === SelectUiType.Secondary && {
    padding: theme.spacing(1, 1.6),
  }),

  ...(itemDisabled && {
    pointerEvents: 'none',
  }),
}));

export const selectDropdownStyles = {
  '.hidden-menu-item': {
    display: 'none',
  },
};
