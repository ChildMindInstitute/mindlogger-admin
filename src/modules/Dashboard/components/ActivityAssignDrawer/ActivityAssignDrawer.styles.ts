import { Box, Button, styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  theme,
  variables,
} from 'shared/styles';

export const StyledHeader = styled(StyledFlexTopCenter)({
  padding: theme.spacing(3.2, 2.4, 2.2, 4),
  borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
});

export const StyledFooterWrapper = styled(Box)({
  marginTop: 'auto',
  position: 'sticky',
  overflow: 'hidden',
  bottom: 0,
});

export const StyledFooter = styled(StyledFlexColumn)(({ hidden }: { hidden?: boolean }) => ({
  padding: theme.spacing(2.4, 4),
  backgroundColor: variables.palette.surface,
  borderTop: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
  transition: variables.transitions.all,
  transform: hidden ? 'translateY(100%)' : 'none',
}));

export const StyledFooterButtonWrapper = styled(StyledFlexAllCenter)(
  ({ step }: { step: 1 | 2 }) => ({
    transition: variables.transitions.all,
    marginRight: 0,
    marginLeft: step === 1 ? '100%' : 0,
  }),
);

export const StyledFooterButton = styled(Button)(({ step }: { step: 1 | 2 }) => ({
  transition: variables.transitions.all,
  transform: step === 1 ? 'translateX(-50%)' : 'none',
}));
