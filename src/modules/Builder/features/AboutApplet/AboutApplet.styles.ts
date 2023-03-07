import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { Svg } from 'shared/components';
import { StyledTitleMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

const column = `
  display: flex;
  flex-direction: column;
`;

export const StyledForm = styled('form')`
  ${column}

  .MuiOutlinedInput-notchedOutline {
    border-color: ${variables.palette.surface_variant};
  }
`;

export const StyledContainer = styled(Box)`
  ${column}
  width: 55rem;
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;
