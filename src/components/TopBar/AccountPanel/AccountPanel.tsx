import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { Icon } from 'components/Icon';
import { StyledMediumTitle } from 'styles/styledComponents/Typography';
import avatarSrc from 'assets/images/avatar.png';
import { variables } from 'styles/variables';

import {
  StyledAccountPanel,
  StyledHeader,
  StyledHideBtn,
  StyledHeaderInfo,
  StyledImage,
  StyledAvatarWrapper,
  StyledHeaderRight,
  StyledFooter,
  StyledLogOutBtn,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

export const AccountPanel = ({ setShowPanel }: AccountPanelProps): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const userData = auth.useUserData();

  const handleLogout = () => {
    dispatch(auth.actions.resetAuthorization());
  };

  return (
    <StyledAccountPanel>
      <StyledHeader>
        <StyledHideBtn onClick={() => setShowPanel(false)}>
          <Icon.NavigateNext color={variables.palette.shades80} />
        </StyledHideBtn>
        <StyledHeaderRight>
          <StyledHeaderInfo>
            <StyledMediumTitle color={variables.palette.shades80}>
              {t('myAccount')}
            </StyledMediumTitle>
            <StyledMediumTitle color={variables.palette.shades80}>
              {userData.email}
            </StyledMediumTitle>
          </StyledHeaderInfo>
          <StyledAvatarWrapper>
            <StyledImage src={avatarSrc} alt="Avatar" />
          </StyledAvatarWrapper>
        </StyledHeaderRight>
      </StyledHeader>
      <StyledFooter>
        <StyledLogOutBtn variant="text" startIcon={<Icon.LogOut />} onClick={handleLogout}>
          {t('logOut')}
        </StyledLogOutBtn>
      </StyledFooter>
    </StyledAccountPanel>
  );
};
