import { MediaType } from 'shared/consts';

export const formatError = {
  [MediaType.Image]: 'incorrectImageFormat',
  [MediaType.Audio]: 'incorrectAudioFormat',
  [MediaType.Video]: 'incorrectVideoFormat',
};
