import { MediaType, VALID_AUDIO_FILE_TYPES, VALID_IMAGE_TYPES, VALID_VIDEO_FILE_TYPES } from 'shared/consts';

export const validFileExtensionsByType = {
  [MediaType.Image]: VALID_IMAGE_TYPES,
  [MediaType.Audio]: VALID_AUDIO_FILE_TYPES,
  [MediaType.Video]: VALID_VIDEO_FILE_TYPES,
};
