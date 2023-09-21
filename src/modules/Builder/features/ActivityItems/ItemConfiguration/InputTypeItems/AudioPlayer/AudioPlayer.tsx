import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium, StyledBodyErrorText, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';
import { MLPlayer } from 'modules/Builder/components/MLPlayer';
import { MediaType } from 'modules/Builder/components/MediaUploader';
import {
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components/ToggleItemContainer';

import { AddAudio } from './AddAudio';
import { UploadAudio } from './UploadAudio';
import { RemoveAudioPopup } from './RemoveAudioPopup';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { getNameByUrl } from './AudioPlayer.utils';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const [isUploadPopupOpened, setUploadPopupOpened] = useState(false);
  const [isRemoveAudioPopupOpened, setRemoveAudioPopupOpened] = useState(false);
  const { setValue, watch, trigger, getFieldState } = useFormContext();

  const urlName = `${name}.responseValues.file`;
  const url = watch(urlName);
  const [media, setMedia] = useState<MediaType | null>(
    url ? { url, name: getNameByUrl(url) } : null,
  );

  const { error } = getFieldState(urlName);

  useEffect(() => {
    trigger(urlName);
    url && setMedia({ ...media, name: getNameByUrl(url) });
  }, [url]);

  const onClearMedia = () => {
    setMedia(null);
    setValue(urlName, undefined);
  };
  const onCloseUploadPopup = () => setUploadPopupOpened(false);

  const onCloseRemoveAudioPopup = () => setRemoveAudioPopupOpened(false);

  const handleUploadAudio = (url?: string) => {
    setValue(urlName, url ?? media?.url);
    onCloseUploadPopup();
  };

  const handleRemoveAudio = () => {
    onClearMedia();
    onCloseRemoveAudioPopup();
  };

  const HeaderContent = ({ open }: SharedToggleItemProps) =>
    !open && !!media ? (
      <StyledNameWrapper>
        {media && <Svg id="check" width={18} height={18} />}
        <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{media?.name}</StyledName>
      </StyledNameWrapper>
    ) : null;

  const Content = () => (
    <Box sx={{ mt: theme.spacing(1) }}>
      <StyledTitleMedium color={variables.palette.on_surface} sx={{ mb: theme.spacing(2.4) }}>
        {t('audioPlayerDescription')}
      </StyledTitleMedium>
      {url ? (
        <MLPlayer media={media} onRemove={() => setRemoveAudioPopupOpened(true)} />
      ) : (
        <AddAudio onUploadAudio={() => setUploadPopupOpened(true)} />
      )}
      {error && (
        <StyledBodyErrorText sx={{ mt: theme.spacing(2.4) }}>{error?.message}</StyledBodyErrorText>
      )}
      <UploadAudio
        open={isUploadPopupOpened}
        media={media}
        onChange={setMedia}
        onUpload={handleUploadAudio}
        onClose={onCloseUploadPopup}
      />
      <RemoveAudioPopup
        open={isRemoveAudioPopupOpened}
        onClose={onCloseRemoveAudioPopup}
        onRemove={handleRemoveAudio}
      />
    </Box>
  );

  return (
    <>
      <ToggleItemContainer
        title={t('audioPlayer')}
        HeaderContent={HeaderContent}
        Content={Content}
      />
    </>
  );
};
