import { CalendarEvent } from 'redux/modules';

export type FollowUpPopups = 'clearSchedule' | 'editEvent' | 'createEvent';

export interface ScheduleProviderProps {
  'data-testid'?: string;
  appletId?: string;
  appletName?: string;
  canCreateIndividualSchedule?: boolean;
  children?: React.ReactNode;
  hasIndividualSchedule?: boolean;
  participantName?: string;
  participantSecretId?: string;
  showEditDefaultConfirmation?: boolean;
  userId?: string;
}

export interface ScheduleContext {
  appletId: string;
  appletName: string;
  canCreateIndividualSchedule: boolean;
  hasIndividualSchedule: boolean;
  onClickClearEvents: () => void;
  onClickCreateEvent: (options?: { startDate?: Date }) => void;
  onClickEditEvent: (options: { event: CalendarEvent; startDate?: Date }) => void;
  participantName?: string;
  participantSecretId?: string;
  selectedEvent?: CalendarEvent;
  userId?: string;
}
