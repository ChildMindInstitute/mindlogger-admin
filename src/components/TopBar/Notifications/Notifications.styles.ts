import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { ACCOUNT_HEADER_HEIGHT, ACCOUNT_FOOTER_HEIGHT } from '../AccountPanel/AccountPanel.const';
import { NOTIFICATIONS_HEADER_HEIGHT } from './Notifications.const';

export const StyledHeader = styled(StyledFlexTopCenter)`
  padding: ${theme.spacing(0, 1.6)};
  justify-content: space-between;
  height: ${NOTIFICATIONS_HEADER_HEIGHT};
`;

export const StyledHeaderLeft = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1)};
`;

export const StyledIconWrapper = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1.6)};
`;

export const StyledCollapseBtn = styled(StyledClearedButton)`
  display: flex;
  align-items: center;
  margin-left: ${theme.spacing(1.4)};
`;

export const StyledList = styled(Box)`
  height: calc(
    100vh - ${ACCOUNT_HEADER_HEIGHT} - ${ACCOUNT_FOOTER_HEIGHT} - ${NOTIFICATIONS_HEADER_HEIGHT} -
      3.2rem
  );
  overflow-y: auto;
`;
