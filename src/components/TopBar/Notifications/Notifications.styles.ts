import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';

import { ACCOUNT_HEADER_HEIGHT, ACCOUNT_FOOTER_HEIGHT } from '../AccountPanel/AccountPanel.const';
import { NOTIFICATIONS_HEADER_HEIGHT } from './Notifications.const';

export const StyledHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${NOTIFICATIONS_HEADER_HEIGHT};
`;

export const StyledHeaderLeft = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing(1)};
`;

export const StyledHeaderRight = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing(0.8)};
`;

export const StyledCollapseBtn = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  height: auto;
  min-width: unset;
  margin-left: ${theme.spacing(1.4)};
`;

export const StyledList = styled(Box)`
  height: calc(
    100vh - ${ACCOUNT_HEADER_HEIGHT} - ${ACCOUNT_FOOTER_HEIGHT} - ${NOTIFICATIONS_HEADER_HEIGHT} -
      3.2rem
  );
  overflow-y: auto;
`;
