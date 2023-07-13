import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  AnswerDTO,
  DecryptedAnswerData,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedGeolocationAnswer,
  DecryptedMediaAnswer,
  DecryptedMultiSelectionPerRowAnswer,
  DecryptedSingleSelectionPerRowAnswer,
  DecryptedSliderRowsAnswer,
  DecryptedStabilityTrackerAnswer,
  DecryptedTimeAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { SingleAndMultipleSelectRowsResponseValues, SliderRowsResponseValues } from 'shared/state';
import { getFileExtension, getMediaFileName, getStabilityTrackerCsvName } from 'shared/utils';

import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = <
  T extends DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
>(
  item: T,
) => {
  const { answer, activityItem, id: answerId } = item;
  const inputType = activityItem.responseType;
  const key =
    answer && answer === Object(answer) ? (Object.keys(answer)?.[0] as keyof AnswerDTO) : undefined;

  const value = getAnswerValue(answer);

  if (!key) return answer || '';

  if (ItemsWithFileResponses.includes(inputType)) {
    try {
      return getMediaFileName(item, getFileExtension((item.answer as DecryptedMediaAnswer).value));
    } catch (error) {
      console.warn(error);
    }
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
      return getMediaFileName(item, 'svg');
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
        answerId,
        (value as DecryptedStabilityTrackerAnswer['value']).phaseType,
      );
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
  }
};
