import { Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { MediaUploader } from 'modules/Builder/components/MediaUploader';
import { Modal } from 'shared/components';
import { StyledTitleMedium, theme } from 'shared/styles';

import { UploadAudioProps } from './UploadAudio.types';

export const UploadAudio = ({ open, media, onUpload, onClose, onChange }: UploadAudioProps) => {
  const { t } = useTranslation('app');

  const handleCloseWithoutChanges = () => {
    onClose();
    onChange(null);
  };
  const handleUpload = () => {
    onUpload();
  };

  const dataTestid = 'builder-activity-items-item-configuration-upload-audio-popup';
  const modalProps = {
    buttonText: media?.uploaded ? t('upload') : t('cancel'),
    hasSecondBtn: !!media?.uploaded,
    secondBtnText: t('cancel'),
    onSubmit: media?.uploaded ? handleUpload : handleCloseWithoutChanges,
    onSecondBtnSubmit: handleCloseWithoutChanges,
    'data-testid': dataTestid,
  };

  return (
    <Modal open={open} title={t('uploadAudio')} onClose={onClose} {...modalProps}>
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }} data-testid={`${dataTestid}-description`}>
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
          data-testid={`${dataTestid}-uploader`}
        />
      </Box>
    </Modal>
  );
};
