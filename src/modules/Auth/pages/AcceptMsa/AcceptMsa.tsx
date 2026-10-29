import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { banners } from 'redux/modules';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { page } from 'resources';
import { LocationStateKeys } from 'shared/types';
import { StyledBodyLarge, StyledLabelMedium, variables } from 'shared/styles';
import { getLongDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import { MSAAcceptAtLoginError } from '../../api';
import { MsaAcceptForm, MsaLink } from '../../features/Msa';
import { navigateAfterLogin } from '../../utils/navigateAfterLogin';
import { RELOGIN_ERROR_KEYS } from './AcceptMsa.const';
import { StyledAcceptMsaPage, StyledMsaCard, StyledSignedInAs } from './AcceptMsa.styles';

const AcceptMsa = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { msaSession, softLockData } = useAppSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Route guard: redirect to login if no session
  useEffect(() => {
    if (!msaSession) {
      navigate(page.login, { replace: true });
    }
  }, [msaSession, navigate]);

  if (!msaSession) {
    return null;
  }

  const handleLogOut = () => {
    dispatch(auth.actions.clearMSASession());
    navigate(page.login, { replace: true });
  };

  const handleAccept = async () => {
    setIsSaving(true);
    setError(undefined);
    const { acceptMSAAtLogin } = auth.thunk;
    const result = await dispatch(acceptMSAAtLogin());

    if (acceptMSAAtLogin.fulfilled.match(result)) {
      // Navigate first, then clear session so the route guard doesn't send the user to login
      navigateAfterLogin(navigate, {
        email: msaSession.email,
        softLockData,
        from: location.state?.[LocationStateKeys.From],
      });
      if (softLockData) {
        dispatch(auth.actions.endSoftLock());
        dispatch(banners.actions.removeBanner({ key: 'SoftLockWarningBanner' }));
      }
      dispatch(auth.actions.clearMSASession());

      return;
    }

    // The login page clears the MSA session when it mounts
    const reloginErrorKey =
      RELOGIN_ERROR_KEYS[(result.payload as MSAAcceptAtLoginError)?.errorCode ?? ''];
    if (reloginErrorKey) {
      navigate(page.login, {
        replace: true,
        state: { [LocationStateKeys.LoginError]: t(reloginErrorKey) },
      });

      return;
    }

    setIsSaving(false);
    setError(t('msaSaveError'));
  };

  // A deadline means the user's grace period has ended (B1); none means first time in admin (B2)
  const { deadline } = msaSession;
  const body = deadline ? (
    <Trans
      t={t}
      i18nKey="msaDeadlinePassedBody"
      values={{ date: getLongDate(parseDateToMidnightLocal(deadline)) }}
      components={{ strong: <strong /> }}
    />
  ) : (
    t('msaFirstTimeBody')
  );

  return (
    <StyledAcceptMsaPage>
      <StyledMsaCard>
        <MsaAcceptForm
          title={t(deadline ? 'msaDeadlinePassedTitle' : 'msaFirstTimeTitle')}
          secondaryButtonText={t('logOut')}
          onSecondaryClick={handleLogOut}
          onAccept={handleAccept}
          isSaving={isSaving}
          error={error}
          data-testid="accept-msa"
        >
          <StyledBodyLarge>{body}</StyledBodyLarge>
          <MsaLink />
          <StyledBodyLarge>{t('msaOtherAppsNote')}</StyledBodyLarge>
        </MsaAcceptForm>
      </StyledMsaCard>
      <StyledSignedInAs>
        <StyledLabelMedium color={variables.palette.on_surface_variant}>
          {t('msaSignedInAs', { email: msaSession.email })}
        </StyledLabelMedium>
      </StyledSignedInAs>
    </StyledAcceptMsaPage>
  );
};

export default AcceptMsa;
