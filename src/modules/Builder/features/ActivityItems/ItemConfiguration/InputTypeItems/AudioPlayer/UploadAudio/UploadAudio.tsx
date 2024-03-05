import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { Modal } from 'shared/components';
import { MediaUploader } from 'modules/Builder/components/MediaUploader';

import { UploadAudioProps } from './UploadAudio.types';
import { uploadAudioPopupDataTestid } from './UploadAudio.const';

export const UploadAudio = ({ open, media, onUpload, onClose, onChange }: UploadAudioProps) => {
  const { t } = useTranslation('app');

  const handleCloseWithoutChanges = () => {
    onClose();
    onChange(null);
  };
  const handleUpload = () => {
    onUpload();
  };

  const modalProps = {
    buttonText: media?.uploaded ? t('upload') : t('cancel'),
    hasSecondBtn: !!media?.uploaded,
    secondBtnText: t('cancel'),
    onSubmit: media?.uploaded ? handleUpload : handleCloseWithoutChanges,
    onSecondBtnSubmit: handleCloseWithoutChanges,
    'data-testid': uploadAudioPopupDataTestid,
  };

  return (
    <Modal open={open} title={t('uploadAudio')} onClose={onClose} {...modalProps}>
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium
          sx={{ mb: theme.spacing(2.4) }}
          data-testid={`${uploadAudioPopupDataTestid}-description`}
        >
          <Trans i18nKey="dropAudio">
            Please upload file in one of the following formats: <strong>.mp3, .wav</strong>.
          </Trans>
        </StyledTitleMedium>
        <MediaUploader
          width={59.6}
          height={20}
          media={media}
          hasPreview
          onUpload={onChange}
          data-testid={`${uploadAudioPopupDataTestid}-uploader`}
        />
      </Box>
    </Modal>
  );
};
