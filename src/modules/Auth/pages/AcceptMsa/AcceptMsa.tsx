import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { page } from 'resources';
import { StyledBodyLarge, StyledLabelMedium, variables } from 'shared/styles';
import { getLongDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import { MsaAcceptForm, MsaLink } from '../../features/Msa';
import { navigateToLibrary } from '../../utils/navigateToLibrary';
import { StyledAcceptMsaPage, StyledMsaCard, StyledSignedInAs } from './AcceptMsa.styles';

const AcceptMsa = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { msaSession } = useAppSelector((state) => state.auth);
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
      navigateToLibrary(navigate);
      dispatch(auth.actions.clearMSASession());

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
