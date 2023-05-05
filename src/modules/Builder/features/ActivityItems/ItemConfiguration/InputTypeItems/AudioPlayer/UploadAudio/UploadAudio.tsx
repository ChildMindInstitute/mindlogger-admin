import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledTitleMedium, StyledTitleSmall, theme } from 'shared/styles';
import { Modal } from 'shared/components';
import { MediaUploader } from 'modules/Builder/components';

import { UploadAudioProps } from './UploadAudio.types';

export const UploadAudio = ({ open, media, onUpload, onClose, onChange }: UploadAudioProps) => {
  const { t } = useTranslation('app');

  const mediaUploaderPlaceholder = (
    <StyledTitleSmall sx={{ textAlign: 'center' }}>
      <Trans i18nKey="mediaUploaderPlaceholder">
        Drop <strong>.mp3</strong> or <strong>.wav</strong> here <br />
        or click to browse.
      </Trans>
    </StyledTitleSmall>
  );

  const handleCloseWithoutChanges = () => {
    onClose();
    onChange(null);
  };

  const modalProps = {
    buttonText: media?.uploaded ? t('audioPlayerUpload') : t('cancel'),
    hasSecondBtn: !!media?.uploaded,
    secondBtnText: t('cancel'),
    onSubmit: media?.uploaded ? onUpload : handleCloseWithoutChanges,
    onSecondBtnSubmit: handleCloseWithoutChanges,
  };

  return (
    <Modal open={open} title={t('uploadAudio')} onClose={onClose} {...modalProps}>
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>
          <Trans i18nKey="dropAudio">
            Please upload file in one of the following formats: <strong>.mp3, .wav</strong>.
          </Trans>
        </StyledTitleMedium>
        <MediaUploader
          width={59.6}
          height={20}
          media={media}
          hasPreview
          placeholder={mediaUploaderPlaceholder}
          onUpload={onChange}
        />
      </Box>
    </Modal>
  );
};
