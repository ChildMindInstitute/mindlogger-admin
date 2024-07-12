import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledBodyMedium, StyledModalWrapper, theme, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import {
  LorisActivityResponse,
  LorisUsersVisit,
  uploadLorisUsersVisitsApi,
} from 'modules/Builder/api';

import { filteredData, findVisitErrorMessage, getScreens } from './UploadDataPopup.utils';
import { Steps, UploadDataForm, UploadDataPopupProps } from './UploadDataPopup.types';
import { StyledSpinnerWrapper } from './UploadDataPopup.styles';
import { uploadDataSchema } from './UploadDataPopup.schema';

export const UploadDataPopup = ({
  open,
  onClose,
  'data-testid': dataTestid,
}: UploadDataPopupProps) => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [step, setStep] = useState<Steps>(Steps.Agreement);
  const [visitsData, setVisitsData] = useState<LorisUsersVisit<LorisActivityResponse>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { execute: uploadLorisUsersVisits } = useAsync(
    uploadLorisUsersVisitsApi,
    () => {
      setStep(Steps.Success);
    },
    () => setStep(Steps.Error),
  );

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { visitsForm: [] },
    resolver: yupResolver(uploadDataSchema()),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = methods;

  const handleAcceptAgreement = useCallback(() => {
    if (!appletId) return;

    setStep(Steps.Visits);
  }, [appletId, setStep]);

  const onSubmit = useCallback(
    (values: UploadDataForm) => {
      if (!appletId) return;
      uploadLorisUsersVisits({ appletId, payload: filteredData(values) });
    },
    [appletId, uploadLorisUsersVisits],
  );

  const onSubmitVisits = useCallback(() => {
    if (!appletId) return;
    handleSubmit(onSubmit)();
  }, [appletId, handleSubmit, onSubmit]);

  const error = findVisitErrorMessage(errors);

  const screens = useMemo(
    () =>
      getScreens({
        handleAcceptAgreement,
        onClose,
        onSubmitVisits,
        setIsLoading,
        visitsData,
        setVisitsData,
        setStep,
      }),
    [
      handleAcceptAgreement,
      onClose,
      onSubmitVisits,
      setIsLoading,
      visitsData,
      setVisitsData,
      setStep,
    ],
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
              data-testid="upload-data-popup-error"
            >
              {error}
            </StyledBodyMedium>
          )}
        </StyledModalWrapper>
      </FormProvider>
    </Modal>
  );
};
