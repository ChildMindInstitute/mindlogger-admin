import { styled, Box } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  variables,
  theme,
  commonStickyStyles,
} from 'shared/styles';

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

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  justify-content: space-between;
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(2.8, 6.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(2.8, 6.4)};
`;
