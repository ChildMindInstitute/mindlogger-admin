import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledTitleMedium, StyledBodyErrorText, theme, variables } from 'shared/styles';
import { MLPlayer } from 'modules/Builder/components/MLPlayer';

import { AddAudio } from '../AddAudio';
import { UploadAudio } from '../UploadAudio';
import { RecordAudio } from '../RecordAudio';
import { RemoveAudioPopup } from '../RemoveAudioPopup';
import { AudioPlayerContentProps } from './AudioPlayerContent.types';

export const AudioPlayerContent = ({ media, setMedia, name }: AudioPlayerContentProps) => {
  const { t } = useTranslation('app');

  const [isUploadPopupOpened, setUploadPopupOpened] = useState(false);
  const [isRecordPopupOpened, setRecordPopupOpened] = useState(false);
  const [isRemoveAudioPopupOpened, setRemoveAudioPopupOpened] = useState(false);
  const { setValue, watch, getFieldState } = useCustomFormContext();

  const urlName = `${name}.responseValues.file`;
  const { error } = getFieldState(urlName);
  const url = watch(urlName);

  const onCloseUploadPopup = () => setUploadPopupOpened(false);
  const onCloseRecordPopup = () => setRecordPopupOpened(false);
  const onCloseRemoveAudioPopup = () => setRemoveAudioPopupOpened(false);

  const onClearMedia = () => {
    setMedia(null);
    setValue(urlName, undefined);
  };

  const handleUploadAudio = (url?: string) => {
    setValue(urlName, url ?? media?.url);
    onCloseUploadPopup();
  };
  const handleUploadRecord = (url?: string) => {
    setValue(urlName, url);
    onCloseRecordPopup();
  };

  const handleRemoveAudio = () => {
    onClearMedia();
    onCloseRemoveAudioPopup();
  };

  return (
    <Box sx={{ mt: theme.spacing(1) }}>
      <StyledTitleMedium color={variables.palette.on_surface} sx={{ mb: theme.spacing(2.4) }}>
        {t('audioPlayerDescription')}
      </StyledTitleMedium>
      {url && <MLPlayer media={media} onRemove={() => setRemoveAudioPopupOpened(true)} />}
      {!url && (
        <AddAudio
          onUploadAudio={() => setUploadPopupOpened(true)}
          onRecordAudio={() => setRecordPopupOpened(true)}
        />
      )}
      {error?.message && (
        <StyledBodyErrorText sx={{ mt: theme.spacing(2.4) }}>{error.message}</StyledBodyErrorText>
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
};
