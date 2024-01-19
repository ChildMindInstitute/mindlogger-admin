import { Dispatch, SetStateAction } from 'react';

import { MediaType } from 'modules/Builder/components';

export type AudioPlayerContentProps = {
  media: MediaType | null;
  setMedia: Dispatch<SetStateAction<MediaType | null>>;
  name: string;
};
