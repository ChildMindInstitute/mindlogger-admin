import { Dispatch, SetStateAction } from 'react';

import { SelectedRespondent } from '../Legend.types';

export type SearchPopupProps = {
  open: boolean;
  setSearchPopupVisible: Dispatch<SetStateAction<boolean>>;
  setSchedule: Dispatch<SetStateAction<null | string>>;
  top?: number;
  left?: number;
  onSelectUser?: (id?: string) => void;
  selectedRespondent: SelectedRespondent;
  respondentsItems?: SelectedRespondent[];
  'data-testid'?: string;
};
