import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarUiType, Svg } from 'shared/components';
import { StyledFlexTopCenter, StyledLabelBoldMedium, variables } from 'shared/styles';
import { page } from 'resources';
import { auth } from 'modules/Auth/state';
import { alerts } from 'shared/state';

import { AccountPanel } from './AccountPanel';
import { Breadcrumbs } from './Breadcrumbs';
import { StyledAvatarBtn, StyledLoginButton, StyledQuantity, StyledTopBar } from './TopBar.styles';

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
      <StyledTopBar>
        <StyledFlexTopCenter>
          <Breadcrumbs />
        </StyledFlexTopCenter>
        {isAuthorized ? (
          <StyledAvatarBtn
            onClick={() => setVisibleAccountDrawer((prevState) => !prevState)}
            variant="text"
          >
            <Avatar caption={userInitials} uiType={AvatarUiType.Secondary} />
            {notWatched > 0 && (
              <StyledQuantity>
                <StyledLabelBoldMedium color={variables.palette.white}>
                  {notWatched}
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
