import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { Svg } from 'components';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

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
  width: 54.6rem;
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  position: absolute;
  margin-left: ${theme.spacing(1)};
`;

export const StyledSettings = styled(Box)`
  ${column}
`;
