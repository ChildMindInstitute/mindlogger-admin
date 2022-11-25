import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { SEARCH_HEIGHT } from 'utils/constants';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const AppletsTableHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: ${theme.spacing(2.4)};
  height: ${SEARCH_HEIGHT};
`;

export const StyledButtons = styled(StyledFlexTopCenter)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
