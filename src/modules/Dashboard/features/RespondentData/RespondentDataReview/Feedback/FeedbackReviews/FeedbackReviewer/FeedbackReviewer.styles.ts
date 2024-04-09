import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledReviewer = styled(Box, shouldForwardProp)`
  background-color: ${variables.palette.surface3};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${({ hasSmallerPaddingBottom }: { hasSmallerPaddingBottom: boolean }) =>
    theme.spacing(2.4, 2.4, hasSmallerPaddingBottom ? 1.7 : 2.4)};
  position: relative;
`;

const border = `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`;

export const StyledItem = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(2.5, 0)};
  border-bottom: ${border};

  ${({ isFirstItem }: { isFirstItem: boolean }) =>
    isFirstItem &&
    `
      border-top: ${border};
      margin-top: ${theme.spacing(2.5)};
  `};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const StyledShowMoreWrapper = styled(StyledFlexTopCenter)`
  padding-top: ${theme.spacing(2.5)};
  justify-content: center;
`;
