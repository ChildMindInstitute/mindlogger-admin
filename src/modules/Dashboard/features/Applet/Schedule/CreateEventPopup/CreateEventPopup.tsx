import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { Mixpanel } from 'shared/utils';

import { EventForm, EventFormRef } from '../EventForm';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';
import { CreateEventPopupProps } from './CreateEventPopup.types';

export const CreateEventPopup = ({
  open,
  setCreateEventPopupVisible,
  defaultStartDate,
}: CreateEventPopupProps) => {
  const { t } = useTranslation('app');
  const eventFormRef = useRef() as RefObject<EventFormRef>;
  const [currentActivityName, setCurrentActivityName] = useState('');
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);

  const handleCreateEventClose = () => setCreateEventPopupVisible(false);

  const onCreateActivitySubmit = () => {
    if (eventFormRef?.current) {
      eventFormRef.current.submitForm();
    }

    Mixpanel.track('Schedule save click');
  };

  const handleRemoveAlwaysAvailableClose = () => {
    setRemoveAlwaysAvailablePopupVisible(false);
  };

  const handleRemoveAllScheduledClose = () => {
    setRemoveAllScheduledPopupVisible(false);
  };

  const handleRemoveAllScheduledSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAllScheduledPopupVisible(false);
      handleCreateEventClose();
    }
  };

  const handleRemoveAlwaysAvailableSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAlwaysAvailablePopupVisible(false);
      handleCreateEventClose();
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleCreateEventClose}
          onSubmit={onCreateActivitySubmit}
          title={t('createActivitySchedule')}
          buttonText={t('save')}
          width="67.1"
          height="81.2rem"
          sxProps={{
            opacity: removeAllScheduledPopupVisible || removeAlwaysAvailablePopupVisible ? 0 : 1,
          }}
          data-testid="dashboard-calendar-create-event-popup"
        >
          <EventForm
            ref={eventFormRef}
            submitCallback={handleCreateEventClose}
            setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
            setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
            setActivityName={setCurrentActivityName}
            defaultStartDate={defaultStartDate}
            data-testid="dashboard-calendar-create-event-popup-form"
          />
        </Modal>
      )}
      {removeAllScheduledPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledPopupVisible}
          onClose={handleRemoveAllScheduledClose}
          onSubmit={handleRemoveAllScheduledSubmit}
          activityName={currentActivityName}
        />
      )}
      {removeAlwaysAvailablePopupVisible && (
        <ConfirmScheduledAccessPopup
          open={removeAlwaysAvailablePopupVisible}
          onClose={handleRemoveAlwaysAvailableClose}
          onSubmit={handleRemoveAlwaysAvailableSubmit}
          activityName={currentActivityName}
        />
      )}
    </>
  );
};
