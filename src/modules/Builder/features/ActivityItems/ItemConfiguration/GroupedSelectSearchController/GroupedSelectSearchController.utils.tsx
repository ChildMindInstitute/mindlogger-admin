import { KeyboardEvent } from 'react';

import { ItemResponseType } from 'shared/consts';

export const handleSearchKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    event.stopPropagation();
  }
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

export const getIsOnlyMobileValue = (value: ItemResponseType): boolean =>
  [
    ItemResponseType.Drawing,
    ItemResponseType.Photo,
    ItemResponseType.Video,
    ItemResponseType.Geolocation,
    ItemResponseType.Audio,
  ].includes(value);
