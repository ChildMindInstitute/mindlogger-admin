import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MediaType } from 'modules/Builder/components/MediaUploader';
import { ToggleItemContainer } from 'modules/Builder/components/ToggleItemContainer';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { getMediaName } from 'shared/utils/getMediaName';

import { AudioPlayerProps } from './AudioPlayer.types';
import { AudioPlayerContent } from './AudioPlayerContent';
import { AudioPlayerHeader } from './AudioPlayerHeader';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const { watch, trigger } = useCustomFormContext();

  const urlName = `${name}.responseValues.file`;
  const url = watch(urlName);
  const [media, setMedia] = useState<MediaType | null>(
    url ? { url, name: getMediaName(url) } : null,
  );

  useEffect(() => {
    if (!url) return;

    trigger(urlName);
    setMedia({ ...media, name: getMediaName(url) });
  }, [url]);

  return (
    <>
      <ToggleItemContainer
        title={t('audioPlayer')}
        HeaderContent={AudioPlayerHeader}
        Content={AudioPlayerContent}
        headerContentProps={{ media }}
        contentProps={{ media, setMedia, name }}
        data-testid="builder-activity-items-item-configuration-audio-player"
      />
    </>
  );
};
