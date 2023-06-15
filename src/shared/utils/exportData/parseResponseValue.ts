import { ItemResponseType } from 'shared/consts';

import { joinWihComma } from '../joinWihComma';

export const parseResponseValue = (item: any, inputType: ItemResponseType) => {
  const key = item === Object(item) ? Object.keys(item)?.[0] : undefined;
  const value = (key && item?.[key]) || '';

  if (!key) return item || '';

  switch (inputType) {
    case ItemResponseType.TimeRange:
      return `time_range: from (hr ${value?.from?.hour}, min ${value?.from?.minute}) / to (hr ${value?.to?.hour}, min ${value?.to?.minute})`;
    case ItemResponseType.Date:
      return `date: ${value?.day}/${value?.month}/${value?.year}`;
    case ItemResponseType.Time:
      return `time: ${value?.hours} ${value?.minutes}`;
    case ItemResponseType.Geolocation:
      return `geo: lat (${value?.latitude}) / long (${value?.longitude})`;
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value) : value}`;
  }
};
