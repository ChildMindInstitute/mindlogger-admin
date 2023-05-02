import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, Svg } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { deleteEventApi } from 'api';
import { applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

import { EditEventPopupProps } from './EditEventPopup.types';
import { EventForm, EventFormRef } from '../EventForm';
import { StyledButton, StyledContainer } from './EditEventPopup.styles';
import { RemoveScheduledEventPopup } from '../RemoveScheduledEventPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';

export const EditEventPopup = ({
  open,
  editedEvent,
  setEditEventPopupVisible,
  defaultStartDate,
}: EditEventPopupProps) => {
  const { t } = useTranslation('app');
  const eventFormRef = useRef() as RefObject<EventFormRef>;
  const [removeSingleScheduledPopupVisible, setRemoveSingleScheduledPopupVisible] = useState(false);
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);
  const [currentActivityName, setCurrentActivityName] = useState('');
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { appletId } = useParams();
  const dispatch = useAppDispatch();

  const { execute: removeEvent } = useAsync(
    deleteEventApi,
    () => appletId && dispatch(applets.thunk.getEvents({ appletId })),
  );

  const handleFormChanged = (isChanged: boolean) => {
    setIsFormChanged(isChanged);
  };

  const onSubmit = () => {
    if (eventFormRef?.current) {
      eventFormRef.current.submitForm();
    }
  };

  const handleRemoveEvent = async () => {
    if (!appletId) return;
    await removeEvent({ appletId, eventId: editedEvent.eventId });
    setRemoveSingleScheduledPopupVisible(false);
  };

  const handleEditEventClose = () => setEditEventPopupVisible(false);

  const onRemoveEventClick = () => {
    setRemoveSingleScheduledPopupVisible(true);
    handleEditEventClose();
  };

  const onRemoveScheduledEventClose = () => {
    setRemoveSingleScheduledPopupVisible(false);
    setEditEventPopupVisible(true);
  };

  const handleRemoveAlwaysAvailableClose = () => {
    setRemoveAlwaysAvailablePopupVisible(false);
    setEditEventPopupVisible(true);
  };

  const handleRemoveAllScheduledClose = () => {
    setRemoveAllScheduledPopupVisible(false);
    setEditEventPopupVisible(true);
  };

  const handleRemoveAllScheduledSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAllScheduledPopupVisible(false);
      handleEditEventClose();
    }
  };

  const handleRemoveAlwaysAvailableSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAlwaysAvailablePopupVisible(false);
      handleEditEventClose();
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleEditEventClose}
          onSubmit={onSubmit}
          title={t('editActivitySchedule')}
          buttonText={t('save')}
          width="67.1"
          disabledSubmit={!!editedEvent && !isFormChanged}
        >
          <>
            <StyledContainer>
              <StyledButton
                variant="outlined"
                type="submit"
                onClick={onRemoveEventClick}
                startIcon={<Svg width="18" height="18" id="clear-calendar" />}
                disabled={editedEvent.alwaysAvailable}
              >
                {t('removeEvent')}
              </StyledButton>
            </StyledContainer>
            <EventForm
              ref={eventFormRef}
              submitCallback={handleEditEventClose}
              setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
              setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
              setActivityName={setCurrentActivityName}
              editedEvent={editedEvent}
              defaultStartDate={defaultStartDate}
              onFormChange={handleFormChanged}
            />
          </>
        </Modal>
      )}
      {removeSingleScheduledPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeSingleScheduledPopupVisible}
          onClose={onRemoveScheduledEventClose}
          onSubmit={handleRemoveEvent}
          activityName={currentActivityName}
        />
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
