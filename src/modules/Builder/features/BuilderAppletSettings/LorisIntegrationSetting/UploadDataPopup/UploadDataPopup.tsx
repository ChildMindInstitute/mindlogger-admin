import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledBodyMedium, StyledModalWrapper, theme, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { LorisActivityForm, LorisUsersVisit, uploadLorisUsersVisitsApi } from 'modules/Builder/api';

import { areAllVisitsFilled, getScreens } from './UploadDataPopup.utils';
import { Steps, UploadDataPopupProps } from './UploadDataPopup.types';
import { StyledSpinnerWrapper } from './UploadDataPopup.styles';

export const UploadDataPopup = ({
  open,
  onClose,
  'data-testid': dataTestid,
}: UploadDataPopupProps) => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [step, setStep] = useState<Steps>(Steps.Agreement);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { execute: uploadLorisUsersVisits } = useAsync(uploadLorisUsersVisitsApi, () => {
    setStep(Steps.Success);
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { visitsForm: [] },
  });

  const { getValues } = methods;

  const handleAcceptAgreement = useCallback(() => {
    if (!appletId) return;

    setStep(Steps.Visits);
  }, [appletId, setStep]);

  const handleSubmitVisits = useCallback(() => {
    if (!appletId) return;

    const payload: LorisUsersVisit<LorisActivityForm>[] = getValues('visitsForm');
    if (!payload?.length || !areAllVisitsFilled(payload)) {
      return setError(t('loris.visitsRequired'));
    }
    setError('');
    uploadLorisUsersVisits({ appletId, payload });
  }, [appletId, getValues, uploadLorisUsersVisits, t]);

  const screens = useMemo(
    () => getScreens({ handleAcceptAgreement, onClose, handleSubmitVisits, setIsLoading, setStep }),
    [handleAcceptAgreement, onClose, handleSubmitVisits, setIsLoading, setStep],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('loris.uploadPublicData')}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].buttonText)}
      disabledSubmit={isLoading}
      hasSecondBtn={screens[step]?.hasSecondBtn}
      secondBtnText={screens[step]?.secondBtnText}
      onSecondBtnSubmit={screens[step]?.onSecondBtnSubmit}
      data-testid={dataTestid}
      width={screens[step]?.width}
    >
      <FormProvider {...methods}>
        <StyledModalWrapper>
          {isLoading && (
            <StyledSpinnerWrapper>
              <Spinner uiType={SpinnerUiType.Secondary} noBackground />
            </StyledSpinnerWrapper>
          )}
          {screens[step].content}
          {error && (
            <StyledBodyMedium
              sx={{ color: variables.palette.semantic.error, mt: theme.spacing(0.6) }}
            >
              {error}
            </StyledBodyMedium>
          )}
        </StyledModalWrapper>
      </FormProvider>
    </Modal>
  );
};
