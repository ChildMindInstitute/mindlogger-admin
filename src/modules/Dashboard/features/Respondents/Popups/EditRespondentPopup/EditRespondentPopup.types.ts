import { ParticipantTag } from 'shared/consts';

import { ChosenAppletData } from '../../Respondents.types';

export type EditRespondentForm = {
  secretUserId: string;
  nickname?: string;
  tag?: ParticipantTag;
};

export type EditRespondentPopupProps = {
  popupVisible: boolean;
  onClose: (isSuccessVisible: boolean) => void;
  chosenAppletData: ChosenAppletData | null;
};
