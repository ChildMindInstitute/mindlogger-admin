import { Dispatch, SetStateAction } from 'react';

import { SelectedRespondent } from '../Legend/Legend.types';

export type RemoveIndividualScheduleProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  isEmpty: boolean;
  setSchedule: Dispatch<SetStateAction<null | string>>;
  setSelectedRespondent: Dispatch<SetStateAction<SelectedRespondent>>;
  'data-testid'?: string;
};
