import { VALID_VIDEO_FILE_TYPES } from 'shared/consts';

export const LANGUAGE_BY_DEFAULT = 'en';
export const THRESHOLD_SIZE = 75;
const VALID_VIDEO_FORMATS_ARRAY = VALID_VIDEO_FILE_TYPES.map((format) => format.slice(1));
export const VALID_VIDEO_FORMATS_REGEX = new RegExp(
  `\\.(${VALID_VIDEO_FORMATS_ARRAY.join('|')})$`,
  'i',
);

export enum VideoSources {
  Youtube = 'youtube.com',
  Youtu = 'youtu.be',
  Vimeo = 'vimeo.com',
}

export enum VideoSourcePlayerLinks {
  Youtube = 'https://www.youtube.com/embed/',
  Vimeo = 'https://player.vimeo.com/video/',
}

const videoSourcesArray = Object.values(VideoSources);
export const VIDEO_LINK_REGEX = new RegExp(
  `^(https?:\\/\\/(?:www\\.)?(${videoSourcesArray.join('|')}))(.+)`,
);
export const YOUTUBE_VIDEO_ID_REGEX = /(?:\?v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/)([^#&?]*).*/;
export const ALIGN_RULE = /^::: hljs-(center|left|right)([\s\S]*?):::/;
