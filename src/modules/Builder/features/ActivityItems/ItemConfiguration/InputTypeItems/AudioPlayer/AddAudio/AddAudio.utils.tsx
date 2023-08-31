import i18n from 'i18n';
import { Svg } from 'shared/components';

import { AddAudioProps } from './AddAudio.types';

const { t } = i18n;

export const getMenuItems = ({ onUploadAudio, onRecordAudio }: AddAudioProps) => [
  {
    title: t('audioPlayerUploadAudio'),
    action: () => onUploadAudio(),
    icon: <Svg id="upload" />,
    'data-testid': 'builder-activity-items-item-configuration-audio-player-upload',
  },
  {
    title: t('audioPlayerRecordAudio'),
    action: () => onRecordAudio(),
    icon: <Svg id="audio" />,
    'data-testid': 'builder-activity-items-item-configuration-audio-player-record',
  },
];
