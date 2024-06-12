import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { LorisUsersVisits, uploadLorisUsersVisitsApi } from 'modules/Builder/api';

import { getScreens } from './UploadDataPopup.utils';
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

  const { execute: uploadLorisUsersVisits } = useAsync(uploadLorisUsersVisitsApi, () => {
    setStep(Steps.Success);
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  const { getValues } = methods;

  const handleAcceptAgreement = useCallback(() => {
    if (!appletId) return;

    setStep((prevStep) => prevStep + 1);
  }, [appletId, setStep]);

  const handleSubmitVisits = useCallback(() => {
    const payload: LorisUsersVisits = getValues();
    uploadLorisUsersVisits(payload);
  }, [getValues, uploadLorisUsersVisits]);

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
    >
      <FormProvider {...methods}>
        <StyledModalWrapper>
          {isLoading && (
            <StyledSpinnerWrapper>
              <Spinner uiType={SpinnerUiType.Secondary} noBackground />
            </StyledSpinnerWrapper>
          )}
          {screens[step].content}
        </StyledModalWrapper>
      </FormProvider>
    </Modal>
  );
};
