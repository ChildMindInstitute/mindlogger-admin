import { SelectedRespondent } from '../Legend.types';

export type SearchPopupProps = {
  open: boolean;
  onClose: () => void;
  top?: number;
  left?: number;
  setSelectedRespondent: (item: SelectedRespondent) => void;
  selectedRespondent: SelectedRespondent;
};
