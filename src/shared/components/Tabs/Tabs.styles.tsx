import { Tabs, styled } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { TABS_HEIGHT } from 'shared/consts';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { UiType } from './Tabs.types';
import { TABS_HORIZONTAL_PADDING } from './Tabs.const';

export const StyledTabs = styled(Tabs, shouldForwardProp)`
  height: ${({
    uiType,
  }: {
    uiType: UiType;
    hiddenHeader?: boolean;
    defaultTabs?: boolean;
    isBuilder?: boolean;
    isCentered?: boolean;
  }) => (uiType === UiType.Primary ? TABS_HEIGHT : '4.8rem')};
  flex-shrink: 0;

  ${({ uiType }) =>
    uiType === UiType.Primary &&
    `
      width: 90rem;
  `};

  ${({ isCentered }) =>
    isCentered
      ? 'margin: 0 auto;'
      : // If the tabs are not centered, use the same left/right spacing
        // as TabPanel so they are horizontally aligned
        `padding: ${theme.spacing(0, TABS_HORIZONTAL_PADDING)};`};

  ${({ isBuilder }) =>
    isBuilder &&
    `
      max-width: calc(100% - 40rem);
  `}

  ${({ hiddenHeader }) =>
    hiddenHeader &&
    `
      &.MuiTabs-root {
        display: none;
      }
  `};

  .MuiTabs-flexContainer {
    justify-content: center;
    gap: 1rem;
  }

  .MuiTab-root {
    opacity: 1;
    color: ${variables.palette.on_surface_variant};
    text-transform: inherit;
    padding: ${({ uiType }) =>
      uiType === UiType.Primary ? theme.spacing(0.8, 0, 0.7) : theme.spacing(1.4, 2.2)};
    justify-content: space-between;
    min-height: ${({ uiType }) => (uiType === UiType.Primary ? TABS_HEIGHT : '4.8rem')};

    ${({ uiType }) =>
      uiType === UiType.Primary &&
      `
        flex-grow: 1;
    `};

    &:hover {
      background-color: ${variables.palette.on_surface_variant_alfa8};
    }

    .MuiBadge-root {
      position: absolute;

      ${({ defaultTabs }) => {
        if (defaultTabs) {
          return `
            left: 1.4rem;
            top: 49%;
            transform: translateY(-50%);

            .MuiBadge-badge {
              min-width: 0.5rem;
              width: 0.5rem;
              height: 0.5rem;
              transform: scale(1.1) translate(50%, -50%);
            }
          `;
        }

        return `
          right: 0.5rem;
        `;
      }}
    }
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  .MuiButtonBase-root.Mui-selected {
    color: ${({ uiType }) =>
      uiType === UiType.Primary ? variables.palette.on_surface : variables.palette.primary};
    font-weight: ${variables.font.weight.regular};
    color: ${variables.palette.primary};

    &:hover {
      background-color: ${variables.palette.primary_alfa8};
    }

    svg {
      fill: ${variables.palette.primary};
    }
  }

  .MuiTabs-indicator {
    height: 0.3rem;
    display: flex;
    justify-content: center;
    background-color: transparent;

    span {
      max-width: 100%;
      width: 100%;
      border-radius: 10rem 10rem 0 0;
      background-color: ${variables.palette.primary};
    }
  }
`;
