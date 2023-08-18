import { MenuItem, styled } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, variables, theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

import { SelectUiType } from './SelectController.types';

export const StyledPlaceholder = styled(StyledBodyLarge)`
  position: absolute;
  left: 1.65rem;
  top: 1.4rem;
  color: ${variables.palette.outline};
`;

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
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
