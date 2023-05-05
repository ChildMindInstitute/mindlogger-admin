import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { StyledTitleMedium, StyledBodyErrorText, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';
import {
  MLPlayer,
  MediaType,
  SharedToggleItemProps,
  ToggleItemContainer,
} from 'modules/Builder/components';

import { AddAudio } from './AddAudio';
import { UploadAudio } from './UploadAudio';
import { RecordAudio } from './RecordAudio';
import { StyledName, StyledNameWrapper } from './AudioPlayer.styles';
import { AudioPlayerProps } from './AudioPlayer.types';
import { getNameByUrl } from './AudioPlayer.utils';

export const AudioPlayer = ({ name }: AudioPlayerProps) => {
  const { t } = useTranslation('app');
  const [isUploadPopupOpened, setUploadPopupOpened] = useState(false);
  const [isRecordPopupOpened, setRecordPopupOpened] = useState(false);
  const { setValue, getValues, trigger, getFieldState } = useFormContext();

  const urlName = `${name}.responseValues.file`;
  const url = getValues(urlName);
  const [media, setMedia] = useState<MediaType | null>(
    url ? { url, name: getNameByUrl(url) } : null,
  );

  const { error } = getFieldState(urlName);

  useEffect(() => {
    trigger(urlName);
  }, [url]);

  const onClearMedia = () => {
    setMedia(null);
    setValue(urlName, undefined);
  };
  const onCloseUploadPopup = () => setUploadPopupOpened(false);
  const onCloseRecordPopup = () => setRecordPopupOpened(false);

  const onUploadAudio = () => {
    onCloseUploadPopup();
    onClearMedia();
  };
  const onUploadRecord = () => {
    onCloseRecordPopup();
    onClearMedia();
  };
  const handleUpload = () => {
    setValue(urlName, media?.url);
    onCloseUploadPopup();
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
      {!url ? (
        <AddAudio
          onUploadAudio={() => setUploadPopupOpened(true)}
          onRecordAudio={() => setRecordPopupOpened(true)}
        />
      ) : (
        <MLPlayer media={media} onRemove={onClearMedia} />
      )}
      {error && (
        <StyledBodyErrorText sx={{ mt: theme.spacing(2.4) }}>{error?.message}</StyledBodyErrorText>
      )}
      <UploadAudio
        open={isUploadPopupOpened}
        media={media}
        onChange={setMedia}
        onUpload={handleUpload}
        onClose={onCloseUploadPopup}
      />
      <RecordAudio open={isRecordPopupOpened} onClose={onCloseRecordPopup} />
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
