import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Box, ClickAwayListener, Divider } from '@mui/material';

import { Avatar, Svg } from 'shared/components';
import { alerts, auth } from 'redux/modules';
import {
  StyledLabelSmall,
  StyledTitleSmall,
  StyledTitleMedium,
  variables,
  StyledIconButton,
  StyledBadge,
} from 'shared/styles';
import { useLogout } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { checkIfAppletUrlPassed } from 'shared/utils/urlGenerator';
import { AccountSettings } from 'modules/Dashboard/features/AccountSettings';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledUserInfoWrapper,
  StyledAvatarWrapper,
  StyledFooter,
  StyledLogOutBtn,
  StyledCloseWrapper,
  StyledSettingsSection,
  StyledSettingsIcon,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

const dataTestid = 'account-panel';

export const AccountPanel = ({ setVisibleDrawer, visibleDrawer }: AccountPanelProps) => {
  const { t } = useTranslation('app');
  const authData = auth.useData();
  const userInitials = auth.useUserInitials();
  const { pathname } = useLocation();
  const handleLogout = useLogout();
  const dispatch = useAppDispatch();
  const { notWatched = 0 } = alerts.useAlertsData() ?? {};
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const onLogout = () => {
    if (checkIfAppletUrlPassed(pathname)) {
      dispatch(auth.actions.startLogout());

      return;
    }

    handleLogout();
  };

  return (
    <ClickAwayListener onClickAway={() => setVisibleDrawer(false)}>
      <StyledAccountDrawer
        data-testid={dataTestid}
        anchor="right"
        open={visibleDrawer}
        hideBackdrop
      >
        <Box>
          <StyledHeader>
            <StyledCloseWrapper>
              <StyledIconButton
                data-testid="account-panel-close"
                onClick={() => setVisibleDrawer(false)}
              >
                <Svg id="close" />
              </StyledIconButton>
            </StyledCloseWrapper>
            <StyledUserInfoWrapper>
              <StyledBadge badgeContent={notWatched} outlineColor={variables.palette.surface1}>
                <StyledAvatarWrapper>
                  <Avatar caption={userInitials} />
                </StyledAvatarWrapper>
              </StyledBadge>
              <StyledHeaderInfo>
                <StyledTitleSmall>{t('myAccount')}</StyledTitleSmall>
                {authData?.user && (
                  <StyledLabelSmall color={variables.palette.on_surface_variant}>
                    {authData.user.email}
                  </StyledLabelSmall>
                )}
              </StyledHeaderInfo>
            </StyledUserInfoWrapper>
            <StyledSettingsSection
              data-testid="account-panel-settings"
              onClick={() => setShowAccountSettings(true)}
            >
              <StyledSettingsIcon>
                <Svg id="settings" width="18" height="18" />
              </StyledSettingsIcon>
              <StyledTitleMedium color={variables.palette.primary}>
                {t('settings')}
              </StyledTitleMedium>
            </StyledSettingsSection>
          </StyledHeader>
          <Divider />
          <Notifications />
        </Box>
        <Divider />
        <StyledFooter>
          <StyledLogOutBtn
            startIcon={<Svg id="logout" width="16" height="20" />}
            onClick={onLogout}
          >
            {t('logOut')}
          </StyledLogOutBtn>
        </StyledFooter>
        <AccountSettings open={showAccountSettings} onClose={() => setShowAccountSettings(false)} />
      </StyledAccountDrawer>
    </ClickAwayListener>
  );
};
