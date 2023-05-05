import { MediaType } from '../MediaUploader';

export type MLPlayerProps = {
  media: MediaType | null;
  hasRemoveButton?: boolean;
  onRemove: () => void;
};
export type MLPlayerStateProps = {
  url?: string | MediaStream | null;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  loadedSeconds: number;
  playedSeconds: number;
  playbackRate: number;
  loop: boolean;
  seeking: boolean;
};
