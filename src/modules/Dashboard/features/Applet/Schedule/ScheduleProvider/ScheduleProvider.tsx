import { createContext, useRef, useState } from 'react';

import { CalendarEvent } from 'redux/modules';
import { EditEventPopup } from 'modules/Dashboard/features/Applet/Schedule/EditEventPopup';
import { ClearScheduledEventsPopup } from 'modules/Dashboard/features/Applet/Schedule/ClearScheduledEventsPopup';
import { ConfirmEditDefaultSchedulePopup } from 'modules/Dashboard/features/Applet/Schedule/ConfirmEditDefaultSchedulePopup';
import { CreateEventPopup } from 'modules/Dashboard/features/Applet/Schedule/CreateEventPopup';
import { SaveChangesPopup } from 'shared/components';

import { FollowUpPopups, ScheduleContext, ScheduleProviderProps } from './ScheduleProvider.types';
import { EventFormRef } from '../EventForm';

const DEFAULT_VALUE = {
  appletId: 'Unknown applet ID',
  appletName: 'Unknown applet',
  canCreateIndividualSchedule: false,
  hasIndividualSchedule: false,
  onClickClearEvents: () => {},
  onClickCreateEvent: () => {},
  onClickEditEvent: () => {},
  participantName: '',
  participantSecretId: '',
  selectedEvent: undefined,
  setSelectedEvent: () => {},
  userId: undefined,
} as ScheduleContext;

export const ScheduleProviderContext = createContext(DEFAULT_VALUE);

export const ScheduleProvider = ({
  'data-testid': dataTestId,
  appletId = 'Unknown applet ID',
  appletName = 'Unknown applet',
  canCreateIndividualSchedule,
  children,
  hasIndividualSchedule,
  participantName = '',
  participantSecretId = '',
  showEditDefaultConfirmation = false,
  userId,
}: ScheduleProviderProps) => {
  const [followUpPopup, setFollowUpPopup] = useState<FollowUpPopups | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [showClearEventsPopup, setShowClearEventsPopup] = useState(false);
  const [showConfirmEditDefaultPopup, setShowConfirmEditDefaultPopup] = useState(false);
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const [showEditEventPopup, setShowEditEventPopup] = useState(false);
  const [showSaveChangesPopup, setShowSaveChangesPopup] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const editEventFormRef = useRef<EventFormRef | null>(null);

  const handleOpenFollowUpPopup = () => {
    setShowConfirmEditDefaultPopup(false);

    switch (followUpPopup) {
      case 'clearSchedule':
        setShowClearEventsPopup(true);
        setFollowUpPopup(null);

        return;
      case 'editEvent':
        setShowEditEventPopup(true);
        setFollowUpPopup(null);

        return;
      case 'createEvent':
      default:
        setShowCreateEventPopup(true);
        setFollowUpPopup(null);

        return;
    }
  };

  const handleShowClearEvents = () => {
    if (showEditDefaultConfirmation) {
      setShowConfirmEditDefaultPopup(true);
      setFollowUpPopup('clearSchedule');
    } else {
      setShowClearEventsPopup(true);
    }
  };

  const handleShowEditEvent = (options: { startDate?: Date; event: CalendarEvent }) => {
    setSelectedEvent(options.event);
    setStartDate(options.startDate ?? new Date());

    if (showEditDefaultConfirmation) {
      setShowConfirmEditDefaultPopup(true);
      setFollowUpPopup('editEvent');
    } else {
      setShowEditEventPopup(true);
    }
  };

  const handleShowCreateEvent = (options?: { startDate?: Date }) => {
    setStartDate(options?.startDate ?? new Date());

    if (showEditDefaultConfirmation) {
      setShowConfirmEditDefaultPopup(true);
      setFollowUpPopup('createEvent');
    } else {
      setShowCreateEventPopup(true);
    }
  };

  const handleCloseEditEventPopup = (formRef?: EventFormRef | null) => {
    if (formRef?.formState.isDirty) {
      setShowSaveChangesPopup(true);
      editEventFormRef.current = formRef;

      return;
    }

    editEventFormRef.current = null;
    setShowEditEventPopup(false);
  };

  const handleSaveChanges = async () => {
    setShowSaveChangesPopup(false);

    const shouldDismissPopups = await editEventFormRef.current?.submitForm();

    if (shouldDismissPopups) {
      setShowEditEventPopup(false);
    }
  };

  const handleDiscardChanges = () => {
    setShowSaveChangesPopup(false);
    setShowEditEventPopup(false);
  };

  return (
    <ScheduleProviderContext.Provider
      value={{
        appletId,
        appletName,
        canCreateIndividualSchedule: canCreateIndividualSchedule ?? false,
        hasIndividualSchedule: hasIndividualSchedule ?? false,
        onClickClearEvents: handleShowClearEvents,
        onClickCreateEvent: handleShowCreateEvent,
        onClickEditEvent: handleShowEditEvent,
        participantName,
        participantSecretId,
        selectedEvent,
        userId,
      }}
    >
      {children}

      {showClearEventsPopup && (
        <ClearScheduledEventsPopup
          appletId={appletId}
          appletName={appletName}
          data-testid={`${dataTestId}-clear-scheduled-events-popup`}
          name={participantName}
          onClose={() => setShowClearEventsPopup(false)}
          open={showClearEventsPopup}
          userId={hasIndividualSchedule && userId ? userId : undefined}
        />
      )}

      <ConfirmEditDefaultSchedulePopup
        appletId={appletId}
        canCreateIndividualSchedule={canCreateIndividualSchedule}
        data-testid={`${dataTestId}-confirm-edit-default-popup`}
        onClose={() => {
          setShowConfirmEditDefaultPopup(false);
        }}
        onOpenFollowUpPopup={handleOpenFollowUpPopup}
        open={showConfirmEditDefaultPopup}
        respondentName={participantName}
        userId={userId}
      />

      <CreateEventPopup
        data-testid={`${dataTestId}-create-event-popup`}
        defaultStartDate={startDate}
        open={showCreateEventPopup}
        setCreateEventPopupVisible={setShowCreateEventPopup}
        userId={hasIndividualSchedule && userId ? userId : undefined}
      />

      <SaveChangesPopup
        popupVisible={showSaveChangesPopup}
        onDontSave={handleDiscardChanges}
        onCancel={() => setShowSaveChangesPopup(false)}
        onSave={handleSaveChanges}
      />

      {selectedEvent && (
        <EditEventPopup
          open={showEditEventPopup}
          editedEvent={selectedEvent}
          setEditEventPopupVisible={(value) => {
            setShowSaveChangesPopup(false);
            setShowEditEventPopup(value);
          }}
          onClose={handleCloseEditEventPopup}
          defaultStartDate={startDate}
          userId={hasIndividualSchedule && userId ? userId : undefined}
          data-testid={`${dataTestId}-edit-event-popup`}
        />
      )}
    </ScheduleProviderContext.Provider>
  );
};
