import { styled } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { StyledFlexColumn } from 'shared/styles/styledComponents/Flex';
import { StyledStickyHeader } from 'shared/styles/styledComponents/StickyHeader';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledActivitySettingsContainer = styled(StyledFlexColumn)`
  position: relative;
  height: 100%;
  overflow-y: auto;
  flex-grow: 1;
`;

export const StyledHeader = styled(StyledStickyHeader, shouldForwardProp)`
  justify-content: space-between;
`;

export const StyledContent = styled(StyledFlexColumn)`
  padding: ${theme.spacing(1.6, 6.4)};
  height: 100%;
`;
