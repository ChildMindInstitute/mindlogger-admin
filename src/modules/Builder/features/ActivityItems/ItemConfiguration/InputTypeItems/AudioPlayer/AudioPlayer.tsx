import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';

import { MediaType } from 'modules/Builder/components/MediaUploader';
import {
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components/ToggleItemContainer';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { getNameByUrl } from './AudioPlayer.utils';
import { AudioPlayerContent } from './AudioPlayerContent';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const { watch, trigger } = useCustomFormContext();

  const urlName = `${name}.responseValues.file`;
  const url = watch(urlName);
  const [media, setMedia] = useState<MediaType | null>(
    url ? { url, name: getNameByUrl(url) } : null,
  );

  useEffect(() => {
    trigger(urlName);
    url && setMedia({ ...media, name: getNameByUrl(url) });
  }, [url]);

  const HeaderContent = ({ open, media }: SharedToggleItemProps & { media: MediaType | null }) =>
    !open && !!media ? (
      <StyledNameWrapper>
        {media && <Svg id="check" width={18} height={18} />}
        <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{media?.name}</StyledName>
      </StyledNameWrapper>
    ) : null;

  return (
    <>
      <ToggleItemContainer
        title={t('audioPlayer')}
        HeaderContent={HeaderContent}
        Content={AudioPlayerContent}
        headerContentProps={{ media }}
        contentProps={{ media, setMedia, name }}
      />
    </>
  );
};
