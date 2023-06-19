import { ItemResponseType } from 'shared/consts';
import { AnswerDTO } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = (item: AnswerDTO, inputType: ItemResponseType) => {
  const key =
    item && item === Object(item) ? (Object.keys(item)?.[0] as keyof AnswerDTO) : undefined;

  const value = getAnswerValue(item) as any;

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
