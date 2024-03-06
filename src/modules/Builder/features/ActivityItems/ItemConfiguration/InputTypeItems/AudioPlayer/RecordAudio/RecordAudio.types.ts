import { Dispatch, SetStateAction } from 'react';

import { MediaType } from 'modules/Builder/components';

export type RecordAudioProps = {
  open: boolean;
  onUpload: (url?: string) => void;
  onChange: (media: MediaType | null) => void;
  onClose: () => void;
};

export type RecorderControls = {
  startRecording: () => void;
  stopRecording: () => void;
  togglePauseResume: () => void;
  clearBlob: () => void;
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  recordingTime: number;
};

export type UseAudioRecorderProps = { setFile: Dispatch<SetStateAction<File | null>> };
