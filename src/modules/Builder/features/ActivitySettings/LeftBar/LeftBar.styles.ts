import { Box, styled } from '@mui/material';

import {
  theme,
  variables,
  commonStickyStyles,
  StyledHeadlineLarge,
  StyledFlexColumn,
  StyledFlexTopStart,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledBar = styled(Box, shouldForwardProp)`
  width: ${({ hasSetting }: { hasSetting: boolean }) => (hasSetting ? '38.7rem' : '100%')};
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
  transition: ${variables.transitions.width};
`;

export const StyledHeader = styled(StyledHeadlineLarge, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(4.8, 1.6, 2.4, 0)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
`;

export const StyledContent = styled(Box, shouldForwardProp)`
  padding-bottom: ${theme.spacing(2.8)};

  ${({ isCompact }: { isCompact: boolean }) =>
    !isCompact &&
    `
    padding-right: ${theme.spacing(13.6)};
  `}
`;

export const StyledGroupContainer = styled(StyledFlexColumn, shouldForwardProp)`
  padding: ${theme.spacing(1.2, 0)};

  ${({ isCompact }: { isCompact: boolean }) =>
    !isCompact &&
    `
    padding: ${theme.spacing(0.8, 0)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  `}
`;

export const StyledItemsContainer = styled(StyledFlexTopStart, shouldForwardProp)`
  margin-left: ${theme.spacing(12)};

  ${({ isCompact }: { isCompact: boolean }) =>
    isCompact &&
    `
    margin: ${theme.spacing(1.6)};
    border-left: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    flex-direction: column;
  `};
`;
