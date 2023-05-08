import { Dispatch, SetStateAction } from 'react';

import { SelectedRespondent } from '../Legend.types';

export type SearchPopupProps = {
  open: boolean;
  setSearchPopupVisible: Dispatch<SetStateAction<boolean>>;
  setSchedule: Dispatch<SetStateAction<null | string>>;
  top?: number;
  left?: number;
  setSelectedRespondent: Dispatch<SetStateAction<SelectedRespondent>>;
  selectedRespondent: SelectedRespondent;
  respondentsItems?: SelectedRespondent[];
};
