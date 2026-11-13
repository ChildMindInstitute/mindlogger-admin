import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { auth } from 'modules/Auth/state';
import { useAppDispatch } from 'redux/store';
import { StyledDialog } from 'shared/components/Modal/Modal.styles';
import { StyledBodyLarge, StyledModalContent, StyledTitleBoldMedium } from 'shared/styles';
import { getLongDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import { useAcceptMsaMutation, useGetMsaStatusQuery } from '../../../api/msaApiSlice';
import { MsaAcceptForm, MsaLink } from '../MsaAcceptForm';

const MSA_VERSION_OUTDATED = 'LEGAL.MSA_VERSION_OUTDATED';

// Shown once after each sign-in while the user is in the MSA grace period
export const MsaGracePrompt = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isPending = auth.useMsaPromptPending();
  const { data: msaStatus, refetch } = useGetMsaStatusQuery();
  const [acceptMsa, { isLoading: isSaving }] = useAcceptMsaMutation();
  const [error, setError] = useState<string>();

  if (!isPending || msaStatus?.status !== 'grace' || !msaStatus.deadline) return null;

  const handleRemindMeLater = () => dispatch(auth.actions.dismissMsaPrompt());

  const handleAccept = async () => {
    setError(undefined);
    const result = await acceptMsa({ msaVersion: msaStatus.version });

    if ('error' in result) {
      const errorData = (result.error as { data?: { error_code?: string } }).data;
      // A newer version was published; refetch it so trying again accepts that one
      if (errorData?.error_code === MSA_VERSION_OUTDATED) refetch();
      setError(t('msaSaveError'));

      return;
    }

    dispatch(auth.actions.dismissMsaPrompt());
  };

  return (
    <StyledDialog open width="66" data-testid="msa-grace-prompt">
      <StyledModalContent>
        <MsaAcceptForm
          title={t('msaUpdatedTitle')}
          secondaryButtonText={t('msaRemindMeLater')}
          onSecondaryClick={handleRemindMeLater}
          onAccept={handleAccept}
          isSaving={isSaving}
          error={error}
          data-testid="msa-grace-prompt-form"
        >
          <StyledBodyLarge>{t('msaUpdatedBody')}</StyledBodyLarge>
          <StyledTitleBoldMedium>
            {t('msaAcceptBy', { date: getLongDate(parseDateToMidnightLocal(msaStatus.deadline)) })}
          </StyledTitleBoldMedium>
          <MsaLink />
          <StyledBodyLarge>{t('msaWebMobileUnaffected')}</StyledBodyLarge>
        </MsaAcceptForm>
      </StyledModalContent>
    </StyledDialog>
  );
};
