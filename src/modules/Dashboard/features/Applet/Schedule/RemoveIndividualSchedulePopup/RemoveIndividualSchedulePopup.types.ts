import { Dispatch, SetStateAction } from 'react';

export type RemoveIndividualScheduleProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  isEmpty: boolean;
  respondentId?: string;
  setSchedule: Dispatch<SetStateAction<null | string>>;
  onSelectUser?: (id?: string) => void;
  'data-testid'?: string;
};
