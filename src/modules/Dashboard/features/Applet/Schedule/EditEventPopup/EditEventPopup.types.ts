import { Dispatch, SetStateAction } from 'react';

import { CalendarEvent } from 'modules/Dashboard/state';

export type EditEventPopupProps = {
  open: boolean;
  editedEvent: CalendarEvent;
  setEditEventPopupVisible: Dispatch<SetStateAction<boolean>>;
  defaultStartDate: Date;
  userId?: string;
};
