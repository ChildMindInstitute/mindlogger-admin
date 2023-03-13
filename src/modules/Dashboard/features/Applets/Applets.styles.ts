import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { SEARCH_HEIGHT } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

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
