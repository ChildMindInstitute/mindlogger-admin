export const getMediaName = (mediaUrl?: string) => decodeURI(mediaUrl?.split('/').at(-1) ?? '');
