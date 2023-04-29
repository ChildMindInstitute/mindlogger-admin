import { MediaType } from '../MediaUploader';

export type MLPlayerProps = {
  media: MediaType | null;
  onRemove: () => void;
};
export type MLPlayerStateProps = {
  url?: string | null;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  loop: boolean;
  seeking: boolean;
};
