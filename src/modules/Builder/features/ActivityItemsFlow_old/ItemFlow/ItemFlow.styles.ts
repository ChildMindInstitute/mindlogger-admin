import { styled, Box, Collapse } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTitle = styled(Box)`
  position: relative;
  min-height: 4.8rem;
  margin: ${theme.spacing(0, 5, 0, 1.5)};

  & .MuiBadge-root {
    position: relative;
    top: unset;
    right: unset;
    margin-right: ${theme.spacing(1.2)};
  }
`;

export const StyledCollapse = styled(Collapse)`
  background: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${theme.spacing(1.6, 2.4)};
`;
