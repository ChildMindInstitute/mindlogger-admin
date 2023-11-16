import { useState, useCallback } from 'react';

import { RecorderControls } from './RecordAudio.types';

export const useAudioRecorder: () => RecorderControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>();
  const [recordingBlob, setRecordingBlob] = useState<Blob[]>([]);

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

  const startRecording = useCallback(() => {
    if (timerInterval) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsStopped(false);
        setIsRecording(true);
        const recorder: MediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        startTimer();

        recorder.addEventListener('dataavailable', (event) => {
          setRecordingBlob([...recordingBlob, event.data]);
        });
      })
      .catch((err) => console.warn(err));
  }, [timerInterval]);

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

  const clearBlob = () => {
    setRecordingBlob([]);
    setRecordingTime(0);
  };

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    clearBlob,
    recordingBlob,
    isRecording,
    isPaused,
    isStopped,
    recordingTime,
  };
};
