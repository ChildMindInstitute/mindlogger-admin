import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { postFileUploadApi } from 'api';
import { StyledLinearProgress, StyledTitleMedium, theme } from 'shared/styles';
import { Modal, Svg } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { getUploadFormData } from 'shared/utils';
import { MLPlayer } from 'modules/Builder/components';

import { useAudioRecorder } from './RecordAudio.hooks';
import { RecordAudioProps } from './RecordAudio.types';
import { StyledButtons, StyledRecordButton } from './RecordAudio.styles';
import { formatSecondsToMinutes } from './RecordAudio.utils';

export const RecordAudio = ({ open, onUpload, onChange, onClose }: RecordAudioProps) => {
  const { t } = useTranslation('app');
  const [url, setUrl] = useState('');

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    clearBlob,
    recordingBlob,
    isRecording,
    isPaused,
    isStopped,
    recordingTime,
  } = useAudioRecorder();

  const { execute: executeAudioUpload, isLoading } = useAsync(
    postFileUploadApi,
    (response) => response?.data?.result && setUrl(response.data.result.url ?? ''),
  );

  useEffect(() => {
    if (isStopped && recordingBlob.length && !url) {
      const file = new File(recordingBlob, 'record.webm', { type: 'audio/webm' });
      const body = getUploadFormData(file);

      executeAudioUpload(body);
    }
  }, [isStopped, recordingBlob, url]);

  const commonSvgProps = {
    width: 16,
    height: 16,
  };

  const handleRemove = () => {
    setUrl('');
    clearBlob();
  };

  const handleStop = () => {
    stopRecording();
    setUrl('');
  };

  const handleUpload = () => {
    onUpload(url);
    onChange({ url });
  };

  const dataTestid = 'builder-activity-items-item-configuration-record-audio-popup';
  const modalProps = {
    open,
    title: t('audioPlayerRecordAudio'),
    buttonText: url ? t('upload') : t('cancel'),
    hasSecondBtn: !!url,
    secondBtnText: t('cancel'),
    onClose,
    onSubmit: url ? handleUpload : onClose,
    onSecondBtnSubmit: onClose,
    footerStyles: {
      paddingTop: theme.spacing(2.1),
    },
    'data-testid': dataTestid,
  };

  return (
    <Modal {...modalProps}>
      <Box sx={{ m: theme.spacing(0, 3.2) }}>
        <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>
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
        {isLoading && <StyledLinearProgress />}
        {url && (
          <MLPlayer
            key={`audio-player-${url}`}
            media={{ url }}
            hasRemoveButton={false}
            onRemove={handleRemove}
            data-testid={`${dataTestid}-player`}
          />
        )}
      </Box>
    </Modal>
  );
};
