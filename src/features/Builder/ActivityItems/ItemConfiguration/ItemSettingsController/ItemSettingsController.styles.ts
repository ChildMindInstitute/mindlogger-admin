import { Box, styled } from '@mui/material';

import { Svg } from 'components';
import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledSettingInfoIcon = styled(Svg)`
  fill: ${variables.palette.outline};
  vertical-align: bottom;
  margin-left: 0.8rem;
`;

export const StyledInputControllerContainer = styled(Box)`
  width: 8rem;
  margin-right: 0.5rem;

  .MuiBox-root {
    margin: ${theme.spacing(0)};
  }

  .MuiButton-root {
    height: 1.2rem;
  }

  .MuiInputBase-root {
    padding: ${theme.spacing(0, 1)};
    border-radius: 1rem;
    border-color: ${variables.palette.on_surface};
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.7, 0)};
  }
`;

export const StyledSettingTitleContainer = styled(Box, shouldForwardProp)`
  ${({ withInput }: { withInput?: boolean }) =>
    withInput &&
    `
  display: flex;
  align-items:center;`}
`;
