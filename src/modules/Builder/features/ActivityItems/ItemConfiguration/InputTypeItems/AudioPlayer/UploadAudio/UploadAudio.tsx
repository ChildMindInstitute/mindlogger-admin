import { Trans, useTranslation } from 'react-i18next';

import { StyledTitleMedium, theme } from 'shared/styles';
import { Modal } from 'shared/components';

import { UploadAudioProps } from './UploadAudio.types';

export const UploadAudio = ({ onClose }: UploadAudioProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal open onClose={onClose} title={t('uploadAudio')} buttonText="button">
      <StyledTitleMedium sx={{ ml: theme.spacing(3.2) }}>
        <Trans i18nKey="dropAudio">
          Please upload file in one of the following formats: <strong>.mp3, .wav.</strong>
        </Trans>
      </StyledTitleMedium>
    </Modal>
  );
};
