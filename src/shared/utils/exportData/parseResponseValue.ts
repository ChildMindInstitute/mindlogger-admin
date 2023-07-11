import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  AnswerDTO,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedDrawingAnswer,
  DecryptedGeolocationAnswer,
  DecryptedMediaAnswer,
  DecryptedTimeAnswer,
} from 'shared/types';

import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = (item: AnswerDTO, inputType: ItemResponseType) => {
  const key =
    item && item === Object(item) ? (Object.keys(item)?.[0] as keyof AnswerDTO) : undefined;

  const value = getAnswerValue(item);

  if (!key) return item || '';

  if (ItemsWithFileResponses.includes(inputType)) {
    return (value as DecryptedMediaAnswer['value']).split('/').pop();
  }

  switch (inputType) {
    case ItemResponseType.TimeRange:
      return `time_range: from (hr ${
        (value as DecryptedDateRangeAnswer['value'])?.from?.hour
      }, min ${(value as DecryptedDateRangeAnswer['value'])?.from?.minute}) / to (hr ${
        (value as DecryptedDateRangeAnswer['value'])?.to?.hour
      }, min ${(value as DecryptedDateRangeAnswer['value'])?.to?.minute})`;
    case ItemResponseType.Date:
      return `date: ${(value as DecryptedDateAnswer['value'])?.day}/${
        (value as DecryptedDateAnswer['value'])?.month
      }/${(value as DecryptedDateAnswer['value'])?.year}`;
    case ItemResponseType.Time:
      return `time: ${(value as DecryptedTimeAnswer['value'])?.hours} ${
        (value as DecryptedTimeAnswer['value'])?.minutes
      }`;
    case ItemResponseType.Geolocation:
      return `geo: lat (${(value as DecryptedGeolocationAnswer['value'])?.latitude}) / long (${
        (value as DecryptedGeolocationAnswer['value'])?.longitude
      })`;
    case ItemResponseType.Drawing:
      return (value as DecryptedDrawingAnswer['value']).uri.split('/').pop();
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
  }
};
