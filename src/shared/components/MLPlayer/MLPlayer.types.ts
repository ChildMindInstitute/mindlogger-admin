import { ResourceDataType } from 'shared/components/MediaUploader/MediaUploader.types';

export type MLPlayerProps = {
  resourceData: ResourceDataType | null;
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
