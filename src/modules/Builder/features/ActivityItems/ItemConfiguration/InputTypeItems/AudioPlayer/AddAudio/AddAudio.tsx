import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';

import { AddAudioProps } from './AddAudio.types';

export const AddAudio = ({ onUploadAudio }: AddAudioProps) => {
  const { t } = useTranslation('app');

  return (
    <Button
      variant="outlined"
      startIcon={<Svg id="upload" />}
      data-testid="builder-activity-items-item-configuration-audio-player-upload"
      onClick={onUploadAudio}
    >
      {t('audioPlayerUploadAudio')}
    </Button>
  );
};
