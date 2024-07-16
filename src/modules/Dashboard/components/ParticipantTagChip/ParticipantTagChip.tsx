import { useTranslation } from 'react-i18next';

import { PARTICIPANT_TAG_ICONS } from 'shared/consts';
import { Chip, Svg } from 'shared/components';

import { ParticipantTagChipProps } from './ParticipantTagChip.types';

export const ParticipantTagChip = ({ tag }: ParticipantTagChipProps) => {
  const { i18n, t } = useTranslation();

  if (!tag) return null;

  return (
    <Chip
      icon={
        tag in PARTICIPANT_TAG_ICONS ? (
          <Svg id={PARTICIPANT_TAG_ICONS[tag]} width={18} height={18} />
        ) : undefined
      }
      color="secondary"
      title={i18n.exists(`participantTag.${tag}`) ? t(`participantTag.${tag}`) : tag}
    />
  );
};
