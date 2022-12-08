import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { TABS_HEIGHT } from 'utils/constants';

export const StyledTabs = styled(Tabs)`
  height: ${TABS_HEIGHT};
  flex-shrink: 0;

  .MuiTab-root {
    color: ${variables.palette.on_surface_variant};
    text-transform: inherit;
    padding: ${theme.spacing(0.8, 2.6, 0.7)};
    justify-content: space-between;
    min-height: ${TABS_HEIGHT};
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  .MuiButtonBase-root.Mui-selected {
    color: ${variables.palette.on_surface};

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
      max-width: 4.5rem;
      width: 100%;
      border-radius: 10rem 10rem 0 0;
      background-color: ${variables.palette.primary};
    }
  }
`;
