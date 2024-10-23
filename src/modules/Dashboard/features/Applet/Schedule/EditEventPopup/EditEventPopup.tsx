import { Button } from '@mui/material';
import { RefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, Spinner, SpinnerUiType, Svg } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { deleteEventApi } from 'api';
import { applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';
import { Mixpanel, MixpanelCalendarEvent } from 'shared/utils/mixpanel';
import { AnalyticsCalendarPrefix } from 'shared/consts';
import { StyledFlexSpaceBetween } from 'shared/styles';

import { EditEventPopupProps } from './EditEventPopup.types';
import { EventForm, EventFormRef } from '../EventForm';
import { RemoveScheduledEventPopup } from '../RemoveScheduledEventPopup';
import { RemoveAllScheduledEventsPopup } from '../RemoveAllScheduledEventsPopup';
import { ConfirmScheduledAccessPopup } from '../ConfirmScheduledAccessPopup';

export const EditEventPopup = ({
  open,
  editedEvent,
  onClose,
  setEditEventPopupVisible,
  defaultStartDate,
  userId,
}: EditEventPopupProps) => {
  const { t } = useTranslation('app');
  const eventFormRef = useRef() as RefObject<EventFormRef>;
  const [removeSingleScheduledPopupVisible, setRemoveSingleScheduledPopupVisible] = useState(false);
  const [removeAllScheduledPopupVisible, setRemoveAllScheduledPopupVisible] = useState(false);
  const [removeAlwaysAvailablePopupVisible, setRemoveAlwaysAvailablePopupVisible] = useState(false);
  const [currentActivityName, setCurrentActivityName] = useState('');
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { appletId } = useParams();
  const dispatch = useAppDispatch();
  const dataTestid = 'dashboard-calendar-edit-event';

  const isIndividualCalendar = !!userId;
  const analyticsPrefix = isIndividualCalendar
    ? AnalyticsCalendarPrefix.IndividualCalendar
    : AnalyticsCalendarPrefix.GeneralCalendar;

  const { execute: removeEvent, isLoading: removeEventIsLoading } = useAsync(
    deleteEventApi,
    () => appletId && dispatch(applets.thunk.getEvents({ appletId, respondentId: userId })),
  );

  const handleFormChanged = (isChanged: boolean) => {
    setIsFormChanged(isChanged);
  };

  const handleFormIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const onSubmit = () => {
    if (eventFormRef?.current) {
      eventFormRef.current.submitForm();
    }

    Mixpanel.track({ action: MixpanelCalendarEvent[analyticsPrefix].ScheduleSaveClick });
  };

  const handleRemoveEvent = async () => {
    if (!appletId) return;
    await removeEvent({ appletId, eventId: editedEvent.eventId });
    setRemoveSingleScheduledPopupVisible(false);
  };

  const handleEditEventClose = () => {
    onClose?.(eventFormRef.current);
  };

  const onRemoveEventClick = () => {
    setRemoveSingleScheduledPopupVisible(true);
    setEditEventPopupVisible(false);
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
      setEditEventPopupVisible(false);
    }
  };

  const handleRemoveAlwaysAvailableSubmit = async () => {
    if (eventFormRef?.current) {
      await eventFormRef.current.processEvent();
      setRemoveAlwaysAvailablePopupVisible(false);
      setEditEventPopupVisible(false);
    }
  };

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleEditEventClose}
          onSubmit={onSubmit}
          title={
            <StyledFlexSpaceBetween sx={{ placeItems: 'center', width: '100%' }}>
              {t('editActivitySchedule')}

              <Button
                variant="tonal"
                type="submit"
                onClick={onRemoveEventClick}
                startIcon={<Svg width="18" height="18" id="clear-calendar" />}
                disabled={editedEvent.alwaysAvailable}
                data-testid={`${dataTestid}-popup-remove`}
              >
                {t('removeEvent')}
              </Button>
            </StyledFlexSpaceBetween>
          }
          buttonText={t('save')}
          width="67.1"
          disabledSubmit={(!!editedEvent && !isFormChanged) || isLoading}
          data-testid={`${dataTestid}-popup`}
        >
          {isLoading && !removeAllScheduledPopupVisible && !removeAlwaysAvailablePopupVisible && (
            <Spinner uiType={SpinnerUiType.Secondary} noBackground />
          )}

          <EventForm
            ref={eventFormRef}
            submitCallback={() => {
              setEditEventPopupVisible(false);
            }}
            setRemoveAllScheduledPopupVisible={setRemoveAllScheduledPopupVisible}
            setRemoveAlwaysAvailablePopupVisible={setRemoveAlwaysAvailablePopupVisible}
            setActivityName={setCurrentActivityName}
            editedEvent={editedEvent}
            defaultStartDate={defaultStartDate}
            onFormIsLoading={handleFormIsLoading}
            onFormChange={handleFormChanged}
            data-testid={`${dataTestid}-popup-form`}
            userId={userId}
          />
        </Modal>
      )}
      {removeSingleScheduledPopupVisible && (
        <RemoveScheduledEventPopup
          open={removeSingleScheduledPopupVisible}
          onClose={onRemoveScheduledEventClose}
          onSubmit={handleRemoveEvent}
          activityName={currentActivityName}
          isLoading={removeEventIsLoading}
          data-testid={`${dataTestid}-remove-scheduled-event-popup`}
        />
      )}
      {removeAllScheduledPopupVisible && (
        <RemoveAllScheduledEventsPopup
          open={removeAllScheduledPopupVisible}
          onClose={handleRemoveAllScheduledClose}
          onSubmit={handleRemoveAllScheduledSubmit}
          activityName={currentActivityName}
          isLoading={isLoading}
          data-testid={`${dataTestid}-remove-all-scheduled-events-popup`}
        />
      )}
      {removeAlwaysAvailablePopupVisible && (
        <ConfirmScheduledAccessPopup
          open={removeAlwaysAvailablePopupVisible}
          onClose={handleRemoveAlwaysAvailableClose}
          onSubmit={handleRemoveAlwaysAvailableSubmit}
          activityName={currentActivityName}
          isLoading={isLoading}
          data-testid={`${dataTestid}-confirm-scheduled-access-popup`}
        />
      )}
    </>
  );
};
