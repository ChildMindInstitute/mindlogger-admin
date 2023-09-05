import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { Error, FileUploader, Modal, SubmitBtnColor } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import {
  deleteIndividualEventsApi,
  deleteScheduledEventsApi,
  importScheduleApi,
  Periodicity,
} from 'modules/Dashboard/api';
import { applet } from 'shared/state';
import { applets } from 'modules/Dashboard/state';

import { getScreens, invalidFileFormatError, uploadLabel } from './ImportSchedule.const';
import { ImportSchedulePopupProps, Steps, UploadedEvent } from './ImportSchedulePopup.types';
import { useImportSchedule } from './ImportSchedulePopup.hooks';
import { prepareImportPayload } from './ImportSchedulePopup.utils';

export const ImportSchedulePopup = ({
  isIndividual = false,
  appletName,
  respondentName,
  open,
  onClose,
  onDownloadTemplate,
  scheduleExportData,
  'data-testid': dataTestid,
}: ImportSchedulePopupProps) => {
  const { t } = useTranslation('app');
  const { appletId, respondentId } = useParams();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const getEvents = () => appletId && dispatch(applets.thunk.getEvents({ appletId, respondentId }));
  const { execute: deleteScheduledEvents, error: deleteScheduledError } =
    useAsync(deleteScheduledEventsApi);
  const { execute: deleteIndividualScheduledEvents, error: deleteIndividualScheduledError } =
    useAsync(deleteIndividualEventsApi);
  const { execute: importSchedule, error: importScheduleError } = useAsync(
    importScheduleApi,
    getEvents,
  );
  const apiError = importScheduleError || deleteScheduledError || deleteIndividualScheduledError;
  const [step, setStep] = useState<Steps>(0);

  const { isSubmitDisabled, setIsSubmitDisabled, uploadedFile, validationError, handleFileReady } =
    useImportSchedule({ appletName, scheduleExportData });

  const fileUploader = (
    <FileUploader
      uploadLabel={uploadLabel}
      onFileReady={handleFileReady}
      invalidFileFormatError={invalidFileFormatError}
      onDownloadTemplate={onDownloadTemplate}
      validationError={validationError}
    />
  );

  const components = {
    default: [
      <StyledBodyLarge>{t('confirmImportSchedule')}</StyledBodyLarge>,
      fileUploader,
      <StyledBodyLarge>
        <Trans i18nKey="confirmUpdateSchedule">
          Are you sure you want to update the default schedule for Applet
          <strong>
            <> {{ appletName }} </>
          </strong>
          and replace the current schedule with information from the
          <strong>
            <> {{ fileName: uploadedFile?.name || '' }} </>
          </strong>
          file?
        </Trans>
      </StyledBodyLarge>,
    ],
    individual: [
      <StyledBodyLarge>
        <Trans i18nKey="confirmImportIndividualSchedule">
          Importing a new individual schedule for respondent
          <strong>
            <>{{ respondentName }})</>
          </strong>
          will replace the respondent’s current individual schedule. Are you sure you want to
          continue?
        </Trans>
      </StyledBodyLarge>,
      fileUploader,
      <StyledBodyLarge>
        <Trans i18nKey="confirmUpdateIndividualSchedule">
          Are you sure you want to update the individual schedule for respondent
          <strong>
            <>{{ respondentName }})</>
          </strong>
          for Applet
          <strong>
            <> {{ appletName }} </>
          </strong>
          and replace the current schedule with information from the
          <strong>
            <> {{ fileName: uploadedFile?.name || '' }} </>
          </strong>
          file?
        </Trans>
      </StyledBodyLarge>,
    ],
  };

  const screens = getScreens(isIndividual ? 'individual' : 'default', components);

  const onSubmit = async () => {
    if (step === 2) {
      if (!appletId) return;

      const uploadedEvents = uploadedFile?.data as unknown as UploadedEvent[];

      const hasScheduledEvents = scheduleExportData.some(
        (event) => event.frequency.toUpperCase() !== Periodicity.Always,
      );

      const body = prepareImportPayload(
        uploadedEvents,
        scheduleExportData,
        appletData,
        respondentId,
      );
      if (hasScheduledEvents) {
        respondentId
          ? await deleteIndividualScheduledEvents({
              appletId,
              respondentId,
            })
          : await deleteScheduledEvents({ appletId });
      }
      await importSchedule({ appletId, body });
      onClose();
    }

    setStep((prevStep) => ++prevStep as Steps);
  };

  useEffect(() => {
    if (step === 1) {
      setIsSubmitDisabled(true);
    }
  }, [step]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t(isIndividual ? 'importIndividualSchedule' : 'importDefaultSchedule')}
      buttonText={t(screens[step].btnText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      secondBtnText={t(screens[step].secondBtnText || '')}
      submitBtnColor={screens[step].submitBtnColor as SubmitBtnColor | undefined}
      onSecondBtnSubmit={onClose}
      disabledSubmit={isSubmitDisabled}
      width="66"
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        {screens[step].component}
        {apiError && <Error error={apiError} sxProps={{ m: theme.spacing(1, 0) }} />}
      </StyledModalWrapper>
    </Modal>
  );
};
