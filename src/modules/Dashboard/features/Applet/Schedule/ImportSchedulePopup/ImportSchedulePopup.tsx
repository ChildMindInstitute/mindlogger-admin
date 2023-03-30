import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { FileUploader, ImportedFile, Modal, SubmitBtnColor } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';

import { getScreens, invalidFileFormatError, uploadLabel } from './ImportSchedule.const';
import { ImportSchedulePopupProps, Steps } from './ImportSchedulePopup.types';

export const ImportSchedulePopup = ({
  isIndividual = false,
  appletName,
  secretUserId,
  nickName,
  open,
  onClose,
}: ImportSchedulePopupProps) => {
  const { t } = useTranslation('app');

  const [step, setStep] = useState<Steps>(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (step === 1) {
      setIsSubmitDisabled(true);
    }
  }, [step]);

  const onFileReady = (file: ImportedFile) => {
    setFileName(file?.name);
    setIsSubmitDisabled(!file);
  };

  const fileUploader = (
    <FileUploader
      uploadLabel={uploadLabel}
      onFileReady={onFileReady}
      invalidFileFormatError={invalidFileFormatError}
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
            <> {{ fileName }} </>
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
            <>
              {' '}
              {{ secretUserId }} ({{ nickName }}){' '}
            </>
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
            <>
              {' '}
              {{ secretUserId }} ({{ nickName }}){' '}
            </>
          </strong>
          for Applet
          <strong>
            <> {{ appletName }} </>
          </strong>
          and replace the current schedule with information from the
          <strong>
            <> {{ fileName }} </>
          </strong>
          file?
        </Trans>
      </StyledBodyLarge>,
    ],
  };

  const screens = getScreens(isIndividual ? 'individual' : 'default', components);

  const onSubmit = () => {
    if (step === 2) {
      onClose();
    }

    setStep((prevStep) => ++prevStep as Steps);
  };

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
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
