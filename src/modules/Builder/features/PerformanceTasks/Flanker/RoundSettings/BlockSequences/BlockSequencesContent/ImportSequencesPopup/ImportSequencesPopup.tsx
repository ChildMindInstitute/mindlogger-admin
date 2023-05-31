import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FileUploader, FileUploaderUiType, Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';

import { invalidFileFormatError, uploadLabel } from './ImportSequencesPopup.const';
import {
  ImportSequencesPopupProps,
  ImportSequencesType,
  Steps,
} from './ImportSequencesPopup.types';
import { useImportSequence } from './ImportSequencesPopup.hooks';
import { getScreens } from './ImportSequencesPopup.utils';

export const ImportSequencesPopup = ({
  open,
  onClose,
  onDownloadCsv,
  onDownloadXlsx,
  uiType,
  imageNames,
  setUploadedTable,
}: ImportSequencesPopupProps) => {
  const { t } = useTranslation('app');
  const [step, setStep] = useState<Steps>(0);

  const { isSubmitDisabled, setIsSubmitDisabled, validationError, handleFileReady, uploadedFile } =
    useImportSequence(imageNames);

  const isUpload = uiType === ImportSequencesType.Upload;
  const downloadText = t(isUpload ? 'downloadTemplate' : 'flankerRound.downloadExistingSequence');

  const components = [
    <FileUploader
      uploadLabel={uploadLabel}
      onFileReady={handleFileReady}
      invalidFileFormatError={invalidFileFormatError}
      onDownloadTemplate={onDownloadCsv}
      onDownloadSecond={onDownloadXlsx}
      downloadFirstText={`${downloadText} (.csv)`}
      downloadSecondText={`${downloadText} (.xlsx)`}
      validationError={validationError}
      uiType={FileUploaderUiType.Secondary}
    />,
    <StyledBodyLarge>{t('flankerRound.successfullyUploaded')}</StyledBodyLarge>,
    <StyledBodyLarge color={variables.palette.semantic.error}>
      {t(`flankerRound.${isUpload ? 'uploadError' : 'updateError'}`)}
    </StyledBodyLarge>,
  ];

  const screens = getScreens(isUpload, components);

  const onSubmit = async () => {
    if (step === 0) {
      if (uploadedFile) {
        setUploadedTable(uploadedFile.data);
      }
    }
    if (step === 1) {
      if (uploadedFile?.data) {
        onClose();

        return;
      }
    }

    if (step === 2) {
      return setStep(0);
    }

    setStep((prevStep) => ++prevStep as Steps);
  };

  useEffect(() => {
    if (step === 0) {
      setIsSubmitDisabled(true);
    }
  }, [step]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t(
        `${isUpload ? 'flankerRound.uploadBlockSequences' : 'flankerRound.updateBlockSequences'}`,
      )}
      buttonText={t(screens[step].btnText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      secondBtnText={t(screens[step].secondBtnText || '')}
      onSecondBtnSubmit={onClose}
      disabledSubmit={isSubmitDisabled}
      width="66"
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
