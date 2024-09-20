import { Box, styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledHeader = styled(StyledFlexTopCenter)({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  background: variables.palette.surface,
  padding: theme.spacing(3.2, 2.4, 2.2, 4),
  borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
});

export const StyledFooterWrapper = styled(Box)({
  marginTop: 'auto',
  position: 'sticky',
  overflow: 'hidden',
  bottom: 0,
  zIndex: theme.zIndex.appBar,
  flexShrink: 0,
});

export const StyledFooter = styled(StyledFlexColumn)({
  padding: theme.spacing(2.4, 4),
  backgroundColor: variables.palette.surface,
  borderTop: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
});
