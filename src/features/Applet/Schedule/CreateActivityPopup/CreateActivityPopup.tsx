import { useTranslation } from 'react-i18next';

import { Modal } from 'components';

import { CreateActivityPopupProps } from './CreateActivityPopup.types';
import { ActivityForm } from '../ActivityForm';

export const CreateActivityPopup = ({ onClose, open }: CreateActivityPopupProps) => {
  const { t } = useTranslation('app');

  const onSubmit = () => onClose();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('createActivitySchedule')}
      buttonText={t('save')}
      width="67.1"
    >
      <ActivityForm onSubmit={onSubmit} />
    </Modal>
  );
};
