import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import {
  AdditionalEdited,
  AdditionalTextType,
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
  ExtendedEvent,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { SingleAndMultipleSelectRowsResponseValues, SliderRowsResponseValues } from 'shared/state';

import {
  getABTrailsCsvName,
  getFileExtension,
  getFlankerCsvName,
  getMediaFileName,
  getStabilityTrackerCsvName,
} from './getReportName';
import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = <
  T extends DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
>(
  item: T,
  index: number,
  isEvent = false,
) => {
  const answer: AnswerDTO | undefined = isEvent
    ? (item as ExtendedEvent<ExtendedExportAnswerWithoutEncryption>).response
    : item.answer;
  const answerEdited = (answer as AdditionalEdited)?.edited;
  const editedWithLabel = answerEdited ? ` | edited: ${answerEdited}` : '';

  if (answer && typeof answer === 'object' && (answer as AdditionalTextType).text?.length) {
    return `${parseResponseValueRaw(item, index, answer)} | text: ${
      (answer as AdditionalTextType).text
    }${editedWithLabel}`;
  }

  return `${parseResponseValueRaw(item, index, answer)}${editedWithLabel}`;
};

export const parseResponseValueRaw = <
  T extends DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
>(
  item: T,
  index: number,
  answer?: AnswerDTO,
) => {
  const { activityItem, id: answerId } = item;
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
        (value as DecryptedDateRangeAnswer['value'])?.to?.hour ?? 0
      }, min ${(value as DecryptedDateRangeAnswer['value'])?.to?.minute ?? 0})`;
    case ItemResponseType.Date:
      return `date: ${(value as DecryptedDateAnswer['value'])?.day}/${
        (value as DecryptedDateAnswer['value'])?.month
      }/${(value as DecryptedDateAnswer['value'])?.year}`;
    case ItemResponseType.Time: {
      const timeValue = value as DecryptedTimeAnswer['value'];

      return `time: hr ${timeValue?.hours || timeValue?.hour}, min ${
        timeValue?.minutes || timeValue?.minute
      }`;
    }
    case ItemResponseType.Geolocation:
      return `geo: lat (${(value as DecryptedGeolocationAnswer['value'])?.latitude}) / long (${
        (value as DecryptedGeolocationAnswer['value'])?.longitude
      })`;
    case ItemResponseType.Drawing:
      return getMediaFileName(item, 'svg');
    case ItemResponseType.ABTrails:
      return getABTrailsCsvName(index, item.id);
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
    case ItemResponseType.Flanker:
      return getFlankerCsvName(item);
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
  }
};
