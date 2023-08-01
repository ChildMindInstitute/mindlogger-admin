import { useEffect, useState } from 'react';
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
  const { result: alertList } = alerts.useAlertsData() ?? {};
  const [visibleAccountDrawer, setVisibleAccountDrawer] = useState(false);
  const [alertsQuantity, setAlertsQuantity] = useState(0);

  const handleLoginClick = () => navigate(page.login);

  useEffect(() => {
    if (!alertList?.length) return;

    const quantity = alertList.filter((alert) => !alert.isWatched).length;
    setAlertsQuantity(quantity);
  }, [alertList]);

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
            {alertsQuantity > 0 && (
              <StyledQuantity>
                <StyledLabelBoldMedium color={variables.palette.white}>
                  {alertsQuantity}
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
          alertsQuantity={alertsQuantity}
          setVisibleDrawer={setVisibleAccountDrawer}
          visibleDrawer={visibleAccountDrawer}
        />
      )}
    </>
  );
};
