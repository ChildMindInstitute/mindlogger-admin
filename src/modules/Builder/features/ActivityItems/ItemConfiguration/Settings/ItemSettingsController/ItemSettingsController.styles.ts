import { Box, styled } from '@mui/material';

import { Svg } from 'shared/components';
import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSettingInfoIcon = styled(Svg)`
  fill: ${variables.palette.outline};
  vertical-align: bottom;
  margin-left: ${theme.spacing(0.8)};
`;

export const StyledInputControllerContainer = styled(Box)`
  width: 8rem;
  margin-right: ${theme.spacing(0.5)};

  .MuiBox-root {
    margin: 0;
  }

  .MuiButton-root {
    height: 1.2rem;
  }

  .MuiInputBase-root {
    padding: ${theme.spacing(0, 1)};
    border-radius: ${variables.borderRadius.lg};
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
