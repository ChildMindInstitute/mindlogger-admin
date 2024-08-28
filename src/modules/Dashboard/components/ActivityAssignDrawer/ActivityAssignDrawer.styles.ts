import { Box, Button, keyframes, styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  theme,
  variables,
} from 'shared/styles';

export const StyledHeader = styled(StyledFlexTopCenter)({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  background: variables.palette.surface,
  padding: theme.spacing(3.2, 2.4, 2.2, 4),
  borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
});

export const StyledPane = styled(StyledFlexColumn)({
  padding: theme.spacing(4),
  flex: 1,
  // Keep hidden panes absolute-positioned for active pane to dictate content height
  '&:not([style*="opacity: 1"])': {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
});

export const StyledFooterWrapper = styled(Box)({
  marginTop: 'auto',
  position: 'sticky',
  overflow: 'hidden',
  bottom: 0,
  zIndex: theme.zIndex.appBar,
  flexShrink: 0,
});

export const StyledFooter = styled(StyledFlexColumn)(({ hidden }: { hidden?: boolean }) => ({
  padding: theme.spacing(2.4, 4),
  backgroundColor: variables.palette.surface,
  borderTop: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
  transition: variables.transitions.all,
  marginBottom: hidden ? '-9.7rem' : 0,
}));

export const StyledFooterButtonWrapper = styled(StyledFlexAllCenter)(
  ({ step }: { step: number }) => ({
    transition: variables.transitions.all,
    marginRight: 0,
    marginLeft: step === 1 ? '100%' : 0,
  }),
);

export const StyledFooterButton = styled(Button)(({ step }: { step: number }) => ({
  transition: variables.transitions.all,
  transform: step === 1 ? 'translateX(-50%)' : 'none',
}));

const successAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(30rem) rotate(-54.652deg);
  }
  100% {
    opacity: 1;
    transform: none;
  }
`;

export const StyledSuccessImage = styled('img')({
  width: '35rem',
  height: '33.8rem',
  animation: `${successAnimation} 0.8s cubic-bezier(0.47, 0, 0.28, 1.18)`,
});
