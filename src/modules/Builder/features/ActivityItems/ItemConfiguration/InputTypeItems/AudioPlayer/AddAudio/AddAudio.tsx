import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithMenu } from 'shared/components';

import { AddAudioProps } from './AddAudio.types';
import { getMenuItems } from './AddAudio.utils';

export const AddAudio = ({ onUploadAudio, onRecordAudio }: AddAudioProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onMenuClose = () => setAnchorEl(null);
  const handleUploadAudio = () => {
    onUploadAudio();
    onMenuClose();
  };
  const handleRecordAudio = () => {
    onRecordAudio();
    onMenuClose();
  };

  return (
    <ButtonWithMenu
      data-testid="builder-activity-items-item-configuration-audio-player-add"
      variant="outlined"
      label={t('addAudio')}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      menuItems={getMenuItems({
        onUploadAudio: handleUploadAudio,
        onRecordAudio: handleRecordAudio,
      })}
    />
  );
};
