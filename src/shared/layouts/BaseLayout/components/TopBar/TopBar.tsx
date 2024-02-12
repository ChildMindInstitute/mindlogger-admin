import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarUiType, Svg } from 'shared/components';
import { Banners } from 'shared/components/Banners';
import { StyledBadge, StyledFlexTopCenter } from 'shared/styles';
import { page } from 'resources';
import { auth } from 'modules/Auth/state';
import { alerts } from 'shared/state';

import { AccountPanel } from './AccountPanel';
import { Breadcrumbs } from './Breadcrumbs';
import { StyledAvatarBtn, StyledLoginButton, StyledTopBar } from './TopBar.styles';

const dataTestid = 'top-bar';

export const TopBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const isAuthorized = auth.useAuthorized();
  const userInitials = auth.useUserInitials();
  const { notWatched = 0 } = alerts.useAlertsData() ?? {};
  const [visibleAccountDrawer, setVisibleAccountDrawer] = useState(false);

  const handleLoginClick = () => navigate(page.login);

  return (
    <>
      <StyledTopBar data-testid={dataTestid}>
        <StyledFlexTopCenter>
          <Breadcrumbs />
        </StyledFlexTopCenter>
        {isAuthorized ? (
          <StyledBadge badgeContent={notWatched} data-testid={`${dataTestid}-badge`}>
            <StyledAvatarBtn
              onClick={() => setVisibleAccountDrawer((prevState) => !prevState)}
              variant="text"
              data-testid={`${dataTestid}-badge-button`}
            >
              <Avatar caption={userInitials} uiType={AvatarUiType.Secondary} />
            </StyledAvatarBtn>
          </StyledBadge>
        ) : (
          <StyledLoginButton
            startIcon={<Svg width="18" height="18" id="profile" />}
            onClick={handleLoginClick}
            data-testid={`${dataTestid}-login-button`}
          >
            {t('loginLink')}
          </StyledLoginButton>
        )}
      </StyledTopBar>
      <Banners />
      {visibleAccountDrawer && (
        <AccountPanel
          setVisibleDrawer={setVisibleAccountDrawer}
          visibleDrawer={visibleAccountDrawer}
        />
      )}
    </>
  );
};
