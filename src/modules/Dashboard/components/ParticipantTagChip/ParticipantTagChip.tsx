import { useTranslation } from 'react-i18next';

import { Chip, Svg } from 'shared/components';
import { PARTICIPANT_TAG_ICONS } from 'shared/consts';

import { ParticipantTagChipProps } from './ParticipantTagChip.types';

export const ParticipantTagChip = ({ tag, ...rest }: ParticipantTagChipProps) => {
  const { i18n, t } = useTranslation();

  if (!tag) return null;

  const hasValidTag = tag in PARTICIPANT_TAG_ICONS;

  return (
    <Chip
      icon={
        hasValidTag ? <Svg id={PARTICIPANT_TAG_ICONS[tag]} width={18} height={18} /> : undefined
      }
      color="secondary"
      title={i18n.exists(`participantTag.${tag}`) ? t(`participantTag.${tag}`) : tag}
      // TODO: Align this with Chip component
      sx={{ padding: '.2rem .8rem .2rem .875rem', gap: '.477rem', height: '2.4rem' }}
      {...rest}
    />
  );
};
