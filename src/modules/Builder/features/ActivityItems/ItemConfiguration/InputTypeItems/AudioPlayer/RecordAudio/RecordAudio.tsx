import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { StyledErrorText, StyledLinearProgress, StyledTitleMedium, theme } from 'shared/styles';
import { Modal, Svg } from 'shared/components';
import { MLPlayer } from 'modules/Builder/components';
import { useMediaUpload } from 'shared/hooks/useMediaUpload';
import { getErrorMessage } from 'shared/utils/errors';

import { useAudioRecorder } from './RecordAudio.hooks';
import { RecordAudioProps } from './RecordAudio.types';
import { StyledButtons, StyledRecordButton } from './RecordAudio.styles';
import { formatSecondsToMinutes } from './RecordAudio.utils';
import { RECORD_FILE_NAME } from './RecordAudio.const';

export const RecordAudio = ({ open, onUpload, onChange, onClose }: RecordAudioProps) => {
  const { t } = useTranslation('app');
  const [file, setFile] = useState<null | File>(null);
  const audioUrl = file && URL.createObjectURL(file);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    clearBlob,
    isRecording,
    isPaused,
    isStopped,
    recordingTime,
  } = useAudioRecorder({ setFile });

  const { executeMediaUpload, isLoading, error, stopUpload } = useMediaUpload({
    callback: (url) => {
      onUpload(url);
      onChange({ url, uploaded: true });
    },
    onStopCallback: onClose,
  });

  const handleUpload = async () => {
    if (!file) return;
    await executeMediaUpload({ file, fileName: RECORD_FILE_NAME });
    setFile(null);
  };

  const handleRemove = () => {
    setFile(null);
    clearBlob();
  };

  const handleStop = () => {
    stopRecording();
    setFile(null);
  };

  const handleClose = () => {
    stopUpload();
    onClose();
  };

  const dataTestid = 'builder-activity-items-item-configuration-record-audio-popup';

  const commonSvgProps = {
    width: 16,
    height: 16,
  };

  const modalProps = {
    open,
    title: t('audioPlayerRecordAudio'),
    buttonText: audioUrl && !isLoading ? t('upload') : t('cancel'),
    hasSecondBtn: !!audioUrl && !isLoading,
    secondBtnText: t('cancel'),
    onClose: handleClose,
    onSubmit: audioUrl ? handleUpload : handleClose,
    onSecondBtnSubmit: handleClose,
    footerStyles: {
      paddingTop: theme.spacing(2.1),
    },
    'data-testid': dataTestid,
  };

  return (
    <Modal {...modalProps}>
      <Box sx={{ m: theme.spacing(0, 3.2) }}>
        <StyledTitleMedium
          sx={{ mb: theme.spacing(2.4) }}
          data-testid={`${dataTestid}-description`}
        >
          {t('audioPlayerRecordAudioDescription')}
        </StyledTitleMedium>
        <StyledButtons>
          <StyledRecordButton>
            <Button
              variant="contained"
              startIcon={
                <Svg id={isPaused || isStopped ? 'audio-filled' : 'pause'} {...commonSvgProps} />
              }
              onClick={isRecording || isPaused ? togglePauseResume : startRecording}
              data-testid={`${dataTestid}-record`}
            >
              {t('audioPlayerRecordStart')}
            </Button>
            <StyledTitleMedium>{formatSecondsToMinutes(recordingTime)}</StyledTitleMedium>
          </StyledRecordButton>
          <Button
            variant="outlined"
            startIcon={<Svg id="audio-stop" {...commonSvgProps} />}
            onClick={handleStop}
            disabled={isStopped}
            data-testid={`${dataTestid}-stop`}
          >
            {t('audioPlayerRecordStop')}
          </Button>
        </StyledButtons>
        {isLoading && <StyledLinearProgress sx={{ mt: theme.spacing(1.5) }} />}
        {audioUrl && !isLoading && (
          <MLPlayer
            key={`audio-player-${audioUrl}`}
            media={{ url: audioUrl }}
            hasRemoveButton={false}
            onRemove={handleRemove}
            data-testid={`${dataTestid}-player`}
          />
        )}
        {error && (
          <StyledErrorText sx={{ mt: theme.spacing(2) }}>{getErrorMessage(error)}</StyledErrorText>
        )}
      </Box>
    </Modal>
  );
};
