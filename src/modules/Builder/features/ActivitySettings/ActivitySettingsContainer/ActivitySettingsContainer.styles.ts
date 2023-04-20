import { styled } from '@mui/material';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  theme,
  variables,
  commonStickyStyles,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledActivitySettingsContainer = styled(StyledFlexColumn)`
  position: relative;
  height: 100%;
  overflow-y: auto;
  flex-grow: 1;
`;

export const StyledHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${commonStickyStyles};

  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
  padding: ${theme.spacing(4.8, 6.4, 2)};
  justify-content: space-between;
`;

export const StyledContent = styled(StyledFlexColumn)`
  padding: ${theme.spacing(1.6, 6.4)};
`;
