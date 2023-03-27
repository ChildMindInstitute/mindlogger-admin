import { Box, styled } from '@mui/material';

import {
  theme,
  variables,
  commonStickyStyles,
  StyledHeadlineLarge,
  StyledFlexColumn,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledBar = styled(Box)`
  width: 40rem;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledHeadlineLarge, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(4.8, 1.6, 2, 1.6)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
`;

export const StyledContent = styled(Box)`
  padding: ${theme.spacing(0, 1.6, 2.8)};
`;

export const StyledGroupContainer = styled(StyledFlexColumn)`
  margin-top: ${theme.spacing(1.6)};
`;
