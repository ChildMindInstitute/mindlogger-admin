export const LANGUAGE_BY_DEFAULT = 'en';
export const THRESHOLD_SIZE = 75;

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
