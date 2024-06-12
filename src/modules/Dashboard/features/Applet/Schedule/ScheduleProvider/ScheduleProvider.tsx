import { createContext, useState } from 'react';

import { CalendarEvent } from 'redux/modules';
import { EditEventPopup } from 'modules/Dashboard/features/Applet/Schedule/EditEventPopup';
import { ClearScheduledEventsPopup } from 'modules/Dashboard/features/Applet/Schedule/ClearScheduledEventsPopup';
import { ConfirmEditDefaultSchedulePopup } from 'modules/Dashboard/features/Applet/Schedule/ConfirmEditDefaultSchedulePopup';
import { CreateEventPopup } from 'modules/Dashboard/features/Applet/Schedule/CreateEventPopup';

import { FollowUpPopups, ScheduleContext, ScheduleProviderProps } from './ScheduleProvider.types';

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
  const [startDate, setStartDate] = useState(new Date());

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

      {selectedEvent && (
        <EditEventPopup
          open={showEditEventPopup}
          editedEvent={selectedEvent}
          setEditEventPopupVisible={(value) => {
            setShowEditEventPopup(value);
          }}
          defaultStartDate={startDate}
          userId={hasIndividualSchedule && userId ? userId : undefined}
          data-testid={`${dataTestId}-edit-event-popup`}
        />
      )}
    </ScheduleProviderContext.Provider>
  );
};
