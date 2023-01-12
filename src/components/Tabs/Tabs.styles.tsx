import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { TABS_HEIGHT } from 'consts';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { UiType } from './Tabs.types';

export const StyledTabs = styled(Tabs, shouldForwardProp)`
  height: ${({ uiType }: { uiType: UiType }) =>
    uiType === UiType.primary ? TABS_HEIGHT : '4.8rem'};
  flex-shrink: 0;

  .MuiTabs-flexContainer {
    justify-content: center;
  }

  .MuiTab-root {
    color: ${variables.palette.on_surface_variant};
    text-transform: inherit;
    padding: ${({ uiType }: { uiType: UiType }) =>
      uiType === UiType.primary ? theme.spacing(0.8, 2.6, 0.7) : theme.spacing(1.4, 2.2)};
    justify-content: space-between;
    min-height: ${({ uiType }: { uiType: UiType }) =>
      uiType === UiType.primary ? TABS_HEIGHT : '4.8rem'};

    &:hover {
      background-color: ${variables.palette.on_surface_variant_alfa8};
    }
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  .MuiButtonBase-root.Mui-selected {
    color: ${({ uiType }: { uiType: UiType }) =>
      uiType === UiType.primary ? variables.palette.on_surface : variables.palette.primary};
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
