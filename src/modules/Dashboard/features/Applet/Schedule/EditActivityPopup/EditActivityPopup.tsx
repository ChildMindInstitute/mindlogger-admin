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
  const [removeScheduledEventPopupVisible, setRemoveScheduledEventPopupVisible] = useState(false);
  const [removeAllScheduledEventsPopupVisible, setRemoveAllScheduledEventsPopupVisible] =
    useState(false);
  const [confirmScheduledAcessPopupVisible, setConfirmScheduledAccessPopupVisible] =
    useState(false);

  const onSubmit = () => {
    if (activityFormRef?.current) {
      activityFormRef.current.submitForm();
    }
  };

  const handleOnClose = () => setEditActivityPopupVisible(false);

  const onRemoveEventClick = () => {
    setRemoveScheduledEventPopupVisible(true);
    handleOnClose();
  };

  const onRemoveScheduledEventClose = () => {
    setRemoveScheduledEventPopupVisible(false);
    setEditActivityPopupVisible(true);
  };

  const onConfirmScheduledAccessClose = () => {
    setConfirmScheduledAccessPopupVisible(false);
    setEditActivityPopupVisible(true);
  };

  const onRemoveAllScheduledEventsClose = () => {
    setRemoveAllScheduledEventsPopupVisible(false);
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
              setRemoveAllEventsPopupVisible={setRemoveAllScheduledEventsPopupVisible}
              setConfirmScheduledAccessPopupVisible={setConfirmScheduledAccessPopupVisible}
            />
          </>
        </Modal>
      )}
      {removeScheduledEventPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeScheduledEventPopupVisible}
          onClose={onRemoveScheduledEventClose}
          onSubmit={() => setRemoveScheduledEventPopupVisible(false)}
          activityName={activityName}
        />
      )}
      {removeAllScheduledEventsPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledEventsPopupVisible}
          onClose={onRemoveAllScheduledEventsClose}
          onSubmit={() => setRemoveAllScheduledEventsPopupVisible(false)}
          activityName={activityName}
        />
      )}
      {confirmScheduledAcessPopupVisible && (
        <ConfirmScheduledAccessPopup
          open={confirmScheduledAcessPopupVisible}
          onClose={onConfirmScheduledAccessClose}
          onSubmit={() => setConfirmScheduledAccessPopupVisible(false)}
          activityName={activityName}
        />
      )}
    </>
  );
};
