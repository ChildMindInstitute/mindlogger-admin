import { styled, Popover } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

const {
  palette: { surface2 },
  boxShadow: { light2 },
  borderRadius: { lg },
} = variables;

export const StyledPopover = styled(Popover)`
  pointer-events: none;

  .MuiPaper-root {
    width: 22.9rem;
    padding: ${theme.spacing(1, 1, 2.4)};
    background-color: ${surface2};
    box-shadow: ${light2};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: ${lg};
  }
`;
