import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'components/Svg';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import avatarSrc from 'assets/images/avatar.png';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledLabelSmall, StyledTitleSmall } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

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
  setShowDrawer,
  showDrawer,
}: AccountPanelProps): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();

  const handleLogout = () => dispatch(auth.actions.resetAuthorization());

  return (
    <StyledAccountDrawer anchor="right" open={showDrawer} hideBackdrop>
      <Box>
        <StyledHeader>
          <StyledFlexTopCenter>
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
            <StyledHeaderInfo>
              <StyledTitleSmall color={variables.palette.on_surface_variant}>
                {t('myAccount')}
              </StyledTitleSmall>
              {authData && (
                <StyledLabelSmall color={variables.palette.on_surface_variant}>
                  {authData.user.email}
                </StyledLabelSmall>
              )}
            </StyledHeaderInfo>
          </StyledFlexTopCenter>
          <StyledCloseWrapper>
            <StyledClearedButton onClick={() => setShowDrawer(false)}>
              <Svg id="close" />
            </StyledClearedButton>
          </StyledCloseWrapper>
        </StyledHeader>
        {alertsQuantity > 0 && <Notifications alertsQuantity={alertsQuantity} />}
      </Box>
      <StyledFooter>
        <StyledLogOutBtn
          variant="text"
          startIcon={<Svg id="logout" width="16" height="20" />}
          onClick={handleLogout}
        >
          {t('logOut')}
        </StyledLogOutBtn>
      </StyledFooter>
    </StyledAccountDrawer>
  );
};
