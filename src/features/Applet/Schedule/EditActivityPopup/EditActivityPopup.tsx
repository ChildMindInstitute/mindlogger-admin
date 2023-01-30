import { useTranslation } from 'react-i18next';

import { Modal, Svg } from 'components';

import { EditActivityPopupProps } from './EditActivityPopup.types';
import { ActivityForm } from '../ActivityForm';
import { StyledButton, StyledContainer } from './EditActivityPopup.styles';

export const EditActivityPopup = ({
  onClose,
  open,
  setRemoveEventPopupVisible,
}: EditActivityPopupProps) => {
  const { t } = useTranslation('app');

  const onSubmit = () => onClose();

  const onRemoveEventClick = () => {
    setRemoveEventPopupVisible(true);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('editActivitySchedule')}
      buttonText={t('save')}
      width="67.1"
    >
      <>
        <StyledContainer>
          <StyledButton
            variant="outlined"
            type="submit"
            onClick={onRemoveEventClick}
            startIcon={<Svg width="18" height="18" id="clear-calendar" />}
          >
            {t('removeEvent')}
          </StyledButton>
        </StyledContainer>
        <ActivityForm onSubmit={onSubmit} />
      </>
    </Modal>
  );
};
