import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledCardItemContainer = styled(Box)`
  &:not(:first-of-type) {
    padding-top: ${theme.spacing(1)};
    margin-top: ${theme.spacing(1)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }

  .md-editor-preview-wrapper {
    padding-left: 0;
    padding-right: 0;
  }

  .md-editor-previewOnly {
    margin-bottom: ${theme.spacing(0.5)};
  }
`;
