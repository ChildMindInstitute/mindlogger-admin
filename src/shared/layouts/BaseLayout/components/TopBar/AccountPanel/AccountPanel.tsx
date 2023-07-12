import { useTranslation } from 'react-i18next';
import { Box, ClickAwayListener } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { Svg } from 'shared/components';
import { auth } from 'redux/modules';
import avatarSrc from 'assets/images/avatar.png';
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
import { Path } from 'shared/utils';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledImage,
  StyledAvatarWrapper,
  StyledFooter,
  StyledLogOutBtn,
  StyledQuantity,
  StyledCloseWrapper,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

export const AccountPanel = ({
  alertsQuantity,
  setVisibleDrawer,
  visibleDrawer,
}: AccountPanelProps) => {
  const { t } = useTranslation('app');
  const authData = auth.useData();
  const { pathname } = useLocation();
  const handleLogout = useLogout();
  const dispatch = useAppDispatch();

  const onLogout = () => {
    if (pathname.includes(Path.Builder)) {
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
                <StyledImage src={avatarSrc} alt="Avatar" />
                {alertsQuantity > 0 && (
                  <StyledQuantity>
                    <StyledLabelBoldSmall color={variables.palette.white}>
                      {alertsQuantity}
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
          <Notifications alertsQuantity={alertsQuantity} />
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
