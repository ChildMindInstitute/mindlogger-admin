import { Dispatch, SetStateAction } from 'react';

import { CalendarEvent } from 'modules/Dashboard/state';

import { EventFormRef } from '../EventForm';

export type EditEventPopupProps = {
  open: boolean;
  editedEvent: CalendarEvent;
  setEditEventPopupVisible: Dispatch<SetStateAction<boolean>>;
  defaultStartDate: Date;
  userId?: string;
  onClose?: (form?: EventFormRef | null) => void;
};
