import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';

import { RecordAudioProps } from './RecordAudio.types';

export const RecordAudio = ({ onClose }: RecordAudioProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal open onClose={onClose} title="title" buttonText="button">
      <div>upload</div>
    </Modal>
  );
};
