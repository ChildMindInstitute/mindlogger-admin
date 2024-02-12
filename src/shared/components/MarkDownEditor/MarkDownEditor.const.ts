export const LANGUAGE_BY_DEFAULT = 'en';
export const THRESHOLD_SIZE = 75;

const videoSources = ['youtube.com', 'youtu.be', 'vimeo.com'];

export const VIDEO_LINK_REGEX = new RegExp(
  `^(https?:\\/\\/(?:www\\.)?(${videoSources.join('|')}))(.+)`,
);
