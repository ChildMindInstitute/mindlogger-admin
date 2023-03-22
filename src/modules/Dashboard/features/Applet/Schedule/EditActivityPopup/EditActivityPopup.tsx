import { useTranslation } from 'react-i18next';
import { RefObject, useRef, useState } from 'react';

import { Modal, Svg } from 'shared/components';

import { EditActivityPopupProps } from './EditActivityPopup.types';
import { ActivityForm, ActivityFormRef } from '../ActivityForm';
import { StyledButton, StyledContainer } from './EditActivityPopup.styles';
import { RemoveScheduledEventPopup } from '../RemoveScheduledEventPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';

export const EditActivityPopup = ({
  open,
  activityName,
  setEditActivityPopupVisible,
}: EditActivityPopupProps) => {
  const { t } = useTranslation('app');
  const activityFormRef = useRef() as RefObject<ActivityFormRef>;
  const [removeSingleScheduledPopupVisible, setRemoveSingleScheduledPopupVisible] = useState(false);
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);
  const [currentActivityName, setCurrentActivityName] = useState(activityName);

  const onSubmit = () => {
    if (activityFormRef?.current) {
      activityFormRef.current.submitForm();
    }
  };

  const handleOnClose = () => setEditActivityPopupVisible(false);

  const onRemoveEventClick = () => {
    setRemoveSingleScheduledPopupVisible(true);
    handleOnClose();
  };

  const onRemoveScheduledEventClose = () => {
    setRemoveSingleScheduledPopupVisible(false);
    setEditActivityPopupVisible(true);
  };

  const onConfirmScheduledAccessClose = () => {
    setRemoveAlwaysAvailablePopupVisible(false);
    setEditActivityPopupVisible(true);
  };

  const onRemoveAllScheduledEventsClose = () => {
    setRemoveAllScheduledPopupVisible(false);
    setEditActivityPopupVisible(true);
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleOnClose}
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
            <ActivityForm
              ref={activityFormRef}
              submitCallback={handleOnClose}
              setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
              setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
              setActivityName={setCurrentActivityName}
            />
          </>
        </Modal>
      )}
      {removeSingleScheduledPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeSingleScheduledPopupVisible}
          onClose={onRemoveScheduledEventClose}
          onSubmit={() => setRemoveSingleScheduledPopupVisible(false)}
          activityName={currentActivityName}
        />
      )}
      {removeAllScheduledPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledPopupVisible}
          onClose={onRemoveAllScheduledEventsClose}
          onSubmit={() => setRemoveAllScheduledPopupVisible(false)}
          activityName={currentActivityName}
        />
      )}
      {removeAlwaysAvailablePopupVisible && (
        <ConfirmScheduledAccessPopup
          open={removeAlwaysAvailablePopupVisible}
          onClose={onConfirmScheduledAccessClose}
          onSubmit={() => setRemoveAlwaysAvailablePopupVisible(false)}
          activityName={currentActivityName}
        />
      )}
    </>
  );
};
