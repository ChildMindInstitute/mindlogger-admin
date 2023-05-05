import { MediaType } from 'modules/Builder/components';

export type RecordAudioProps = {
  open: boolean;
  onUpload: (url?: string) => void;
  onChange: (media: MediaType | null) => void;
  onClose: () => void;
};
