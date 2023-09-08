import { useTranslation } from 'react-i18next';
import { Box, ClickAwayListener } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { Avatar, Svg } from 'shared/components';
import { alerts, auth } from 'redux/modules';
import {
  StyledLabelBoldSmall,
  StyledLabelSmall,
  StyledTitleSmall,
  StyledFlexTopCenter,
  StyledClearedButton,
  variables,
} from 'shared/styles';
import { useLogout } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { checkIfAppletUrlPassed } from 'shared/utils';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledAvatarWrapper,
  StyledFooter,
  StyledLogOutBtn,
  StyledQuantity,
  StyledCloseWrapper,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

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
      <StyledAccountDrawer anchor="right" open={visibleDrawer} hideBackdrop>
        <Box>
          <StyledHeader>
            <StyledFlexTopCenter>
              <StyledAvatarWrapper>
                <Avatar caption={userInitials} />
                {notWatched > 0 && (
                  <StyledQuantity>
                    <StyledLabelBoldSmall color={variables.palette.white}>
                      {notWatched}
                    </StyledLabelBoldSmall>
                  </StyledQuantity>
                )}
              </StyledAvatarWrapper>
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
              <StyledClearedButton onClick={() => setVisibleDrawer(false)}>
                <Svg id="close" />
              </StyledClearedButton>
            </StyledCloseWrapper>
          </StyledHeader>
          <Notifications />
        </Box>
        <StyledFooter>
          <StyledLogOutBtn
            variant="text"
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
