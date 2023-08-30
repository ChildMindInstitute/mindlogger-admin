import { styled, Box } from '@mui/material';

import { StyledFlexColumn, variables, theme } from 'shared/styles';

export const StyledItemConfiguration = styled(StyledFlexColumn)`
  position: relative;
  height: 100%;
  flex-grow: 1;
  overflow-y: auto;

  .MuiFormHelperText-root {
    position: absolute;
    top: 100%;
    font-size: ${variables.font.size.md};
  }

  .md-editor.isRequired + .MuiTypography-root {
    font-size: ${variables.font.size.md};
    white-space: nowrap;
    margin: ${theme.spacing(0, 1.4)};
  }
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(2.8, 6.4)};
`;
