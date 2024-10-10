import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import {
  getLorisUsersVisitsApi,
  getLorisVisitsApi,
  uploadLorisUsersVisitsApi,
} from 'modules/Builder/api';
import { Modal } from 'shared/components/Modal';
import { Spinner, SpinnerUiType, Svg } from 'shared/components';
import { StyledModalWrapper, theme } from 'shared/styles';
import { useAsync } from 'shared/hooks';

import { UploadDataForm, UploadPopupProps, UploadSteps } from './UploadPopup.types';
import { filteredData, formatData, getScreens } from './UploadPopup.utils';
import { uploadDataSchema } from './UploadPopup.schema';

export const UploadPopup = ({ open, onClose }: UploadPopupProps) => {
  const { appletId } = useParams();
  const { t } = useTranslation();
  const methods = useForm({
    mode: 'onChange',
    defaultValues: { visitsForm: [] },
    resolver: yupResolver(uploadDataSchema()),
  });

  const { handleSubmit, reset } = methods;

  const [step, setStep] = useState(UploadSteps.CurrentConnectionInfo);
  const [visitsList, setVisitsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { execute: uploadLorisUsersVisits } = useAsync(
    uploadLorisUsersVisitsApi,
    () => {
      setStep(UploadSteps.Success);
    },
    () => setStep(UploadSteps.Error),
  );

  const handleNextClick = useCallback(async () => {
    if (!appletId) return;
    try {
      setIsLoading(true);
      const [visitsResult, usersVisitsResult] = await Promise.all([
        getLorisVisitsApi(appletId),
        getLorisUsersVisitsApi({ appletId }),
      ]);

      if (usersVisitsResult?.data?.result) {
        const visitsForm = formatData(usersVisitsResult?.data?.result);
        reset({ visitsForm });

        if (visitsResult?.data?.visits) {
          setVisitsList(visitsResult.data.visits);
        }

        visitsForm.length ? setStep(UploadSteps.SelectVisits) : setStep(UploadSteps.EmptyState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [appletId, reset]);

  const onSubmit = useCallback(
    (values: UploadDataForm) => {
      if (!appletId) return;

      const payload = filteredData(values);
      if (!payload.length) return;
      uploadLorisUsersVisits({ appletId, payload });
    },
    [appletId, uploadLorisUsersVisits],
  );

  const handleSubmitVisits = useCallback(() => {
    if (!appletId) return;
    handleSubmit(onSubmit)();
  }, [appletId, handleSubmit, onSubmit]);

  const screens = useMemo(
    () =>
      getScreens({
        visitsList,
        onClose,
        setStep,
        handleNextClick,
        handleSubmitVisits,
      }),
    [visitsList, onClose, setStep, handleNextClick, handleSubmitVisits],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={94} height={94} id="loris-integration" />
          </Box>
          {t('loris.dataUploadTitle')}
        </>
      }
      onSubmit={screens[step].rightButtonClick}
      buttonText={screens[step].rightButtonText}
      hasLeftBtn={!!(screens[step].leftButtonText && screens[step].leftButtonClick)}
      onLeftBtnSubmit={screens[step].leftButtonClick}
      leftBtnText={screens[step].leftButtonText}
      width={screens[step].width}
      disabledSubmit={isLoading}
      data-testid="loris-upload-popup"
    >
      <StyledModalWrapper sx={{ mt: theme.spacing(1.2), minHeight: '14rem' }}>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <FormProvider {...methods}>{!isLoading && <>{screens[step].content}</>}</FormProvider>
      </StyledModalWrapper>
    </Modal>
  );
};
