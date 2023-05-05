export type RecordAudioProps = {
  open: boolean;
  onClose: () => void;
};

export const enum RecordAudioStatus {
  STARTED = 'started',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}
