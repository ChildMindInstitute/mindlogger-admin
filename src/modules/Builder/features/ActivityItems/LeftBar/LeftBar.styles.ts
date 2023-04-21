import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledHeadlineLarge } from 'shared/styles/styledComponents';
import { commonStickyStyles } from 'shared/styles/stylesConsts';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledBar = styled(Box, shouldForwardProp)`
  width: ${({ hasActiveItem }: { hasActiveItem: boolean }) => (hasActiveItem ? '40rem' : '100%')};
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  padding: ${({ hasActiveItem }) => (hasActiveItem ? 0 : '0 4.8rem')};
  overflow-y: auto;
  transition: ${variables.transitions.width};
`;

export const StyledHeaderTitle = styled(StyledHeadlineLarge, shouldForwardProp)`
  ${commonStickyStyles};
  width: unset;
  padding: ${theme.spacing(2.8, 1.6, 2, 5.6)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
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
