import { Box, styled } from '@mui/material';

import {
  commonStickyStyles,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  theme,
  variables,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledReviewContainer = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
`;

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(2.4, 6.4)};
`;

export const StyledEmptyReview = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 40rem;
  height: 100%;
  text-align: center;

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledWrapper = styled(StyledFlexAllCenter)`
  height: calc(100% - 9.6rem);
`;
