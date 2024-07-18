import { Respondent } from 'modules/Dashboard/types';
import { joinWihComma } from 'shared/utils';

import { ParticipantDropdownOption } from './ParticipantDropdown.types';

export const participantToOption = (participant: Respondent): ParticipantDropdownOption => {
  const stringNicknames = joinWihComma(participant.nicknames, true);
  const stringSecretIds = joinWihComma(participant.secretIds, true);

  return {
    id: participant.details[0].subjectId,
    userId: participant.id,
    secretId: stringSecretIds,
    nickname: stringNicknames,
    tag: participant.details[0].subjectTag,
  };
};
