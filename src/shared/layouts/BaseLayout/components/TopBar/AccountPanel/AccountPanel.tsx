import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box, ClickAwayListener } from '@mui/material';

import { Avatar, Svg } from 'shared/components';
import { alerts, auth } from 'redux/modules';
import {
  StyledLabelSmall,
  StyledTitleSmall,
  StyledFlexTopCenter,
  variables,
  StyledIconButton,
  StyledBadge,
} from 'shared/styles';
import { useLogout } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { checkIfAppletUrlPassed } from 'shared/utils/urlGenerator';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledAvatarWrapper,
  StyledFooter,
  StyledLogOutBtn,
  StyledCloseWrapper,
  StyledDivider,
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
            <StyledFlexTopCenter>
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
            </StyledFlexTopCenter>
            <StyledCloseWrapper>
              <StyledIconButton onClick={() => setVisibleDrawer(false)}>
                <Svg id="close" />
              </StyledIconButton>
            </StyledCloseWrapper>
          </StyledHeader>
          <Notifications />
        </Box>
        <StyledDivider />
        <StyledFooter>
          <StyledLogOutBtn
            startIcon={<Svg id="logout" width="16" height="20" />}
            onClick={onLogout}
          >
            {t('logOut')}
          </StyledLogOutBtn>
        </StyledFooter>
      </StyledAccountDrawer>
    </ClickAwayListener>
  );
};
