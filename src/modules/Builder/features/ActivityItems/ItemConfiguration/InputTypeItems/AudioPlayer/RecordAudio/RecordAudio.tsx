import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { StyledBodyErrorText, StyledFlexAllCenter, StyledTitleMedium, theme } from 'shared/styles';
import { Modal, Svg } from 'shared/components';

import { useAudioRecorder } from './RecordAudio.hooks';
import { RecordAudioProps, RecordAudioStatus } from './RecordAudio.types';

export const RecordAudio = ({ open, onClose }: RecordAudioProps) => {
  const { t } = useTranslation('app');

  const { status, error, onStart, onStop, onPause } = useAudioRecorder();

  const commonSvgProps = {
    width: 16,
    height: 16,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('audioPlayerRecordAudio')}
      buttonText={t('cancel')}
    >
      <Box sx={{ ml: theme.spacing(3.2) }}>
        <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>
          {t('audioPlayerRecordAudioDescription')}
        </StyledTitleMedium>
        <StyledFlexAllCenter sx={{ gap: '1.6rem' }}>
          <Button
            variant="contained"
            startIcon={
              <Svg
                id={status === RecordAudioStatus.PAUSED ? 'pause' : 'audio-filled'}
                {...commonSvgProps}
              />
            }
            onClick={status !== RecordAudioStatus.STARTED ? onStart : onPause}
          >
            {t('audioPlayerRecordStart')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Svg id="audio-stop" {...commonSvgProps} />}
            onClick={onStop}
          >
            {t('audioPlayerRecordStop')}
          </Button>
        </StyledFlexAllCenter>
        {error && <StyledBodyErrorText>{error}</StyledBodyErrorText>}
      </Box>
    </Modal>
  );
};
