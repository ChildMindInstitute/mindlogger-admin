import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledHeadlineLarge } from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledBar = styled(Box)`
  width: 40rem;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledHeadlineLarge, shouldForwardProp)`
  position: sticky;
  width: 100%;
  top: 0;
  padding: ${theme.spacing(2.8, 1.6, 2, 5.6)};
  background-color: ${variables.palette.surface};
  z-index: ${theme.zIndex.fab};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  transition: ${variables.transitions.boxShadow};
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(0, 1.6, 2.8)};
`;

export const StyledBtnWrapper = styled(Box)`
  text-align: center;

  svg {
    fill: ${variables.palette.primary};
  }
`;
