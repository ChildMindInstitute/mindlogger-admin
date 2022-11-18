import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { StyledLabelSmall, StyledTitleSmall } from 'styles/styledComponents/Typography';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import avatarSrc from 'assets/images/avatar.png';
import { variables } from 'styles/variables';
import { Svg } from 'components/Svg';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledImage,
  StyledAvatarWrapper,
  StyledHeaderRight,
  StyledFooter,
  StyledLogOutBtn,
  StyledQuantity,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

export const AccountPanel = ({
  alertsQuantity,
  setShowDrawer,
  showDrawer,
}: AccountPanelProps): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();

  const handleLogout = () => {
    dispatch(auth.actions.resetAuthorization());
  };

  return (
    <StyledAccountDrawer anchor="right" open={showDrawer}>
      <Box>
        <StyledHeader>
          <StyledClearedButton onClick={() => setShowDrawer(false)}>
            <Svg id="navigate-next" />
          </StyledClearedButton>
          <StyledHeaderRight>
            <StyledHeaderInfo>
              {authData && (
                <StyledTitleSmall color={variables.palette.on_surface_variant}>
                  {`${authData.user.firstName}${
                    authData.user.lastName ? ` ${authData.user.lastName}` : ''
                  }`}
                </StyledTitleSmall>
              )}
              {authData && (
                <StyledTitleSmall color={variables.palette.on_surface_variant}>
                  {authData.user.email}
                </StyledTitleSmall>
              )}
            </StyledHeaderInfo>
            <StyledAvatarWrapper>
              <StyledImage src={avatarSrc} alt="Avatar" />
              {alertsQuantity > 0 && (
                <StyledQuantity>
                  <StyledLabelSmall fontWeight="semiBold" color={variables.palette.white}>
                    {alertsQuantity}
                  </StyledLabelSmall>
                </StyledQuantity>
              )}
            </StyledAvatarWrapper>
          </StyledHeaderRight>
        </StyledHeader>
        {alertsQuantity > 0 && <Notifications alertsQuantity={alertsQuantity} />}
      </Box>
      <StyledFooter>
        <StyledLogOutBtn variant="text" startIcon={<Svg id="logout" />} onClick={handleLogout}>
          {t('logOut')}
        </StyledLogOutBtn>
      </StyledFooter>
    </StyledAccountDrawer>
  );
};
