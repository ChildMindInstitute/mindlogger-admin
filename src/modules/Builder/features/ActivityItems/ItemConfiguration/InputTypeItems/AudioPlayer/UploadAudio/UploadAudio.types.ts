import { MediaType } from 'modules/Builder/components';

export type UploadAudioProps = {
  open: boolean;
  media: MediaType | null;
  onClose: () => void;
  onUpload: () => void;
  onChange: (media: MediaType | null) => void;
};
