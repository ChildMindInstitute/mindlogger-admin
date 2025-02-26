import { Participant } from 'modules/Dashboard/types';
import { joinWihComma } from 'shared/utils';
import i18n from 'i18n';
import { TEAM_MEMBER_ROLES } from 'shared/consts';

import { ParticipantDropdownOption } from './ParticipantDropdown.types';

export const participantToOption = (participant: Participant): ParticipantDropdownOption => {
  const isTeamMember = participant.details[0].roles.some((role) =>
    TEAM_MEMBER_ROLES.includes(role),
  );

  let stringNicknames = joinWihComma(participant.nicknames, true);
  // Due to a BE bug, for certain edge cases, it's possible for Team Members to lack nicknames; if
  // so, fall back to full name (which is what the BE should be doing consistently).
  if (!stringNicknames && isTeamMember) {
    stringNicknames = joinWihComma(
      participant.details.map((d) => `${d.subjectFirstName} ${d.subjectLastName}`),
      true,
    );
  }
  const stringSecretIds = joinWihComma(participant.secretIds, true);

  return {
    id: participant.details[0].subjectId,
    userId: participant.id,
    secretId: stringSecretIds,
    nickname: stringNicknames,
    tag: participant.details[0].subjectTag,
    isTeamMember,
    roles: participant.details[0].roles,
  };
};

export const getParticipantLabel = (value: ParticipantDropdownOption) => {
  const { t } = i18n;

  let translatedTag = '';
  if (value.tag) {
    translatedTag = i18n.exists(`participantTag.${value.tag}`)
      ? ` (${t(`participantTag.${value.tag}`)})`
      : ` (${value.tag})`;
  }

  if (value.isTeamMember) {
    return `${value.nickname}${translatedTag}`;
  }

  return `${value.secretId}${value.nickname ? ` (${value.nickname})` : ''}${translatedTag}`;
};
