import { useState, useCallback } from 'react';

import { RecorderControls, UseAudioRecorderProps } from './RecordAudio.types';
import { RECORD_FILE_NAME } from './RecordAudio.const';

export const useAudioRecorder = ({ setFile }: UseAudioRecorderProps): RecorderControls => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>();

  const startTimer = () => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    timerInterval !== null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  };

  const clearBlob = () => {
    setRecordingTime(0);
  };

  const startRecording = useCallback(() => {
    if (timerInterval) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsStopped(false);
        setIsRecording(true);
        clearBlob();
        const recorder: MediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        startTimer();

        recorder.addEventListener('dataavailable', (event) => {
          const file = new File([event.data], RECORD_FILE_NAME, { type: 'audio/webm' });
          setFile(file);
        });
      })
      .catch((err) => console.warn(err));
  }, [timerInterval, setFile]);

  const togglePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorder?.resume();
      startTimer();
    } else {
      setIsPaused(true);
      stopTimer();
      mediaRecorder?.pause();
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(true);
  };

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    clearBlob,
    isRecording,
    isPaused,
    isStopped,
    recordingTime,
  };
};
