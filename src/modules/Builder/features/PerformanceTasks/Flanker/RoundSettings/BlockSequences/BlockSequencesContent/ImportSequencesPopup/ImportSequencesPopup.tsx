import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { FileUploader, FileUploaderUiType, Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';

import { invalidFileFormatError, uploadLabel } from './ImportSequencesPopup.const';
import { useImportSequence } from './ImportSequencesPopup.hooks';
import { ImportSequencesPopupProps, ImportSequencesType } from './ImportSequencesPopup.types';
import { getScreens } from './ImportSequencesPopup.utils';

export const ImportSequencesPopup = ({
  open,
  onClose,
  onDownloadCsv,
  onDownloadXlsx,
  uiType,
  uploadedImages,
  setUploadedTable,
}: ImportSequencesPopupProps) => {
  const { t } = useTranslation('app');
  const [step, setStep] = useState<number>(0);
  const { isSubmitDisabled, validationError, handleFileReady, uploadedData } = useImportSequence(uploadedImages);

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

  const incrementStep = () => setStep((prevStep) => prevStep + 1);

  const onSubmit = () => {
    switch (step) {
      case 0:
        return uploadedData ? incrementStep() : setStep(2);
      case 1:
        uploadedData && setUploadedTable({ data: uploadedData, isInitial: false });

        return onClose();
      case 2:
        return setStep(0);
    }
  };

  const handleModalClose = () => {
    if (step === 1 && uploadedData) {
      setUploadedTable({ data: uploadedData, isInitial: false });
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      onSubmit={onSubmit}
      title={t(`${isUpload ? 'flankerRound.uploadBlockSequences' : 'flankerRound.updateBlockSequences'}`)}
      buttonText={t(screens[step].btnText)}
      hasSecondBtn={screens[step].hasSecondBtn}
      secondBtnText={t(screens[step].secondBtnText || '')}
      onSecondBtnSubmit={onClose}
      disabledSubmit={isSubmitDisabled}
      width="66"
      data-testid="builder-activity-flanker-block-sequences-upload-popup"
    >
      <StyledModalWrapper>{screens[step].component}</StyledModalWrapper>
    </Modal>
  );
};
