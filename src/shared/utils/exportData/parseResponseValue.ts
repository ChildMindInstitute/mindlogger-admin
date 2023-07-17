import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  AnswerDTO,
  DecryptedABTrailsAnswer,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedDrawingAnswer,
  DecryptedGeolocationAnswer,
  DecryptedMediaAnswer,
  DecryptedMultiSelectionPerRowAnswer,
  DecryptedSingleSelectionPerRowAnswer,
  DecryptedSliderRowsAnswer,
  DecryptedStabilityTrackerAnswer,
  DecryptedTimeAnswer,
} from 'shared/types';
import {
  Item,
  SingleAndMultipleSelectRowsResponseValues,
  SliderRowsResponseValues,
} from 'shared/state';
import { getStabilityTrackerCsvName } from 'shared/utils';

import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = (answer: AnswerDTO, activityItem: Item, id: string) => {
  const inputType = activityItem.responseType;
  const key =
    answer && answer === Object(answer) ? (Object.keys(answer)?.[0] as keyof AnswerDTO) : undefined;

  const value = getAnswerValue(answer);

  if (!key) return answer || '';

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
      return `time: hr ${(value as DecryptedTimeAnswer['value'])?.hours}, min ${
        (value as DecryptedTimeAnswer['value'])?.minutes
      }`;
    case ItemResponseType.Geolocation:
      return `geo: lat (${(value as DecryptedGeolocationAnswer['value'])?.latitude}) / long (${
        (value as DecryptedGeolocationAnswer['value'])?.longitude
      })`;
    case ItemResponseType.Drawing:
      return (value as DecryptedDrawingAnswer['value']).uri.split('/').pop();
    case ItemResponseType.ABTrails:
      return value as DecryptedABTrailsAnswer['value'];
    case ItemResponseType.SingleSelectionPerRow: {
      const rows = (activityItem?.responseValues as SingleAndMultipleSelectRowsResponseValues).rows;

      return rows
        .map(
          (row, index) =>
            `${row.rowName}: ${
              (value as DecryptedSingleSelectionPerRowAnswer['value'])[index] ?? ''
            }`,
        )
        .join('\n');
    }
    case ItemResponseType.MultipleSelectionPerRow: {
      const rows = (activityItem?.responseValues as SingleAndMultipleSelectRowsResponseValues).rows;

      return rows
        .map(
          (row, index) =>
            `${row.rowName}: ${
              (value as DecryptedMultiSelectionPerRowAnswer['value'])[index]?.join(', ') ?? ''
            }`,
        )
        .join('\n');
    }
    case ItemResponseType.SliderRows: {
      const rows = (activityItem?.responseValues as SliderRowsResponseValues).rows;

      return rows
        .map(
          (row, index) =>
            `${row.label}: ${(value as DecryptedSliderRowsAnswer['value'])[index] ?? ''}`,
        )
        .join('\n');
    }
    case ItemResponseType.StabilityTracker:
      return getStabilityTrackerCsvName(
        id,
        (value as DecryptedStabilityTrackerAnswer['value']).phaseType,
      );
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
  }
};
