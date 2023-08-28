import { styled, Box } from '@mui/material';

import { SEARCH_HEIGHT } from 'shared/consts';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const AppletsTableHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: ${theme.spacing(2.4)};
  height: ${SEARCH_HEIGHT};
`;

export const StyledButtons = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
