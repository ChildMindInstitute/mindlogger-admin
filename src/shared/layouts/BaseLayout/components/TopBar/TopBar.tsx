import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledFlexTopCenter, StyledLabelBoldMedium, variables } from 'shared/styles';
import avatarSrc from 'assets/images/avatar.png';
import { page } from 'resources';
import { auth } from 'modules/Auth/state';
import { alerts } from 'shared/state';

import { AccountPanel } from './AccountPanel';
import { Breadcrumbs } from './Breadcrumbs';
import {
  StyledTopBar,
  StyledAvatarBtn,
  StyledImage,
  StyledQuantity,
  StyledLoginButton,
} from './TopBar.styles';

export const TopBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const isAuthorized = auth.useAuthorized();
  const { notWatchedAlertsCount = 0 } = alerts.useAlertsData() ?? {};
  const [visibleAccountDrawer, setVisibleAccountDrawer] = useState(false);

  const handleLoginClick = () => navigate(page.login);

  return (
    <>
      <StyledTopBar>
        <StyledFlexTopCenter>
          <Breadcrumbs />
        </StyledFlexTopCenter>
        {isAuthorized ? (
          <StyledAvatarBtn
            onClick={() => setVisibleAccountDrawer((prevState) => !prevState)}
            variant="text"
          >
            <StyledImage src={avatarSrc} alt="Avatar" />
            {notWatchedAlertsCount > 0 && (
              <StyledQuantity>
                <StyledLabelBoldMedium color={variables.palette.white}>
                  {notWatchedAlertsCount}
                </StyledLabelBoldMedium>
              </StyledQuantity>
            )}
          </StyledAvatarBtn>
        ) : (
          <StyledLoginButton
            startIcon={<Svg width="18" height="18" id="profile" />}
            onClick={handleLoginClick}
          >
            {t('loginLink')}
          </StyledLoginButton>
        )}
      </StyledTopBar>
      {visibleAccountDrawer && (
        <AccountPanel
          setVisibleDrawer={setVisibleAccountDrawer}
          visibleDrawer={visibleAccountDrawer}
        />
      )}
    </>
  );
};
