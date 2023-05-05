import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { RecordAudioStatus } from './RecordAudio.types';

export const useAudioRecorder = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<RecordAudioStatus>(RecordAudioStatus.STOPPED);
  const [error, setError] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Array<Blob>>([]);

  useEffect(() => {
    const onDataAvailable = (event: BlobEvent) => chunks.current.push(event.data);

    mediaRecorder.current?.addEventListener('dataavailable', onDataAvailable, false);

    return () => {
      mediaRecorder.current?.removeEventListener('dataavailable', onDataAvailable);
    };
  }, [mediaRecorder.current]);

  const onStart = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (status === RecordAudioStatus.STOPPED) {
          mediaRecorder.current = new MediaRecorder(stream);
        }

        mediaRecorder.current?.start();

        setStatus(RecordAudioStatus.STARTED);
      })
      .catch((e) => {
        setError(t('audioPlayerDeviceError') as string);
      });
  };
  const onPause = () => {
    mediaRecorder.current?.pause();

    setStatus(RecordAudioStatus.PAUSED);
  };
  const onStop = () => {
    mediaRecorder.current?.stop();

    setStatus(RecordAudioStatus.STOPPED);
  };

  return {
    error,
    status,
    onStart,
    onPause,
    onStop,
  };
};
