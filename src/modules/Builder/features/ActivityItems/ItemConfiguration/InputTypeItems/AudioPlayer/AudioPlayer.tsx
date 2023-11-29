import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledTitleMedium, StyledBodyErrorText, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { MLPlayer } from 'modules/Builder/components/MLPlayer';
import { MediaType } from 'modules/Builder/components/MediaUploader';
import {
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components/ToggleItemContainer';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { AddAudio } from './AddAudio';
import { UploadAudio } from './UploadAudio';
import { RecordAudio } from './RecordAudio';
import { RemoveAudioPopup } from './RemoveAudioPopup';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { getNameByUrl } from './AudioPlayer.utils';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const [isUploadPopupOpened, setUploadPopupOpened] = useState(false);
  const [isRecordPopupOpened, setRecordPopupOpened] = useState(false);
  const [isRemoveAudioPopupOpened, setRemoveAudioPopupOpened] = useState(false);
  const { setValue, watch, trigger, getFieldState } = useCustomFormContext();

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
    setValue(urlName, undefined, { shouldDirty: true });
  };
  const onCloseUploadPopup = () => setUploadPopupOpened(false);
  const onCloseRecordPopup = () => setRecordPopupOpened(false);

  const onCloseRemoveAudioPopup = () => setRemoveAudioPopupOpened(false);

  const handleUploadAudio = (url?: string) => {
    setValue(urlName, url ?? media?.url, { shouldDirty: true });
    onCloseUploadPopup();
  };
  const handleUploadRecord = (url?: string) => {
    setValue(urlName, url, { shouldDirty: true });
    onCloseRecordPopup();
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
        <AddAudio
          onUploadAudio={() => setUploadPopupOpened(true)}
          onRecordAudio={() => setRecordPopupOpened(true)}
        />
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
      <RecordAudio
        open={isRecordPopupOpened}
        onChange={setMedia}
        onUpload={handleUploadRecord}
        onClose={onCloseRecordPopup}
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
