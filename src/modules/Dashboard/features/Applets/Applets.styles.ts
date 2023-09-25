import { styled, Box } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const AppletsTableHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledButtons = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
