import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';

import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    color: ${variables.palette.shades80};
    text-transform: inherit;
    padding: ${theme.spacing(0.8, 2.6, 0.7)};
    min-height: 6.4rem;
  }

  .MuiButtonBase-root.Mui-selected {
    color: ${variables.palette.shades95};

    svg path {
      fill: ${variables.palette.primary50};
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
      background-color: ${variables.palette.primary50};
    }
  }
`;
