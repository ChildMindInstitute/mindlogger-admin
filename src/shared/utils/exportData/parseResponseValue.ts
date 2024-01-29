import { ItemResponseType } from 'shared/consts';
import {
  AdditionalEdited,
  AdditionalTextType,
  AnswerDTO,
  DecryptedAnswerData,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedGeolocationAnswer,
  DecryptedMultiSelectionPerRowAnswer,
  DecryptedSingleSelectionPerRowAnswer,
  DecryptedSliderRowsAnswer,
  DecryptedStabilityTrackerAnswerObject,
  DecryptedTimeAnswer,
  ExtendedEvent,
  isMediaAnswerData,
  UserActionType,
} from 'shared/types';

import {
  getABTrailsCsvName,
  getFileExtension,
  getFlankerCsvName,
  getMediaFileName,
  getStabilityTrackerCsvName,
} from './getReportName';
import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

export const parseResponseValue = <T extends DecryptedAnswerData>(
  item: T,
  index: number,
  isEvent = false,
) => {
  let answer: AnswerDTO | undefined;
  if (!isEvent) {
    answer = item.answer;
  }
  if (isEvent && (item as ExtendedEvent).type === UserActionType.SetAnswer) {
    answer = (item as ExtendedEvent).response ?? item.answer;
  }

  const answerEdited = (answer as AdditionalEdited)?.edited;
  const editedWithLabel = answerEdited ? ` | edited: ${answerEdited}` : '';
  const responseValue = parseResponseValueRaw(item, index, answer);

  if (answer && typeof answer === 'object' && (answer as AdditionalTextType).text?.length) {
    return `${responseValue !== '' ? `${responseValue} | ` : ''}text: ${
      (answer as AdditionalTextType).text
    }${editedWithLabel}`;
  }

  return `${responseValue}${editedWithLabel}`;
};

export const parseResponseValueRaw = <T extends DecryptedAnswerData>(
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
  if (key === 'text') return '';
  if (isMediaAnswerData(item)) {
    try {
      if (!item.answer?.value) return '';

      return getMediaFileName(
        item,
        getFileExtension(typeof item.answer.value === 'string' ? item.answer.value : ''),
      );
    } catch (error) {
      console.warn(error);
    }
  }

  switch (inputType) {
    case ItemResponseType.TimeRange:
      return `time_range: from (hr ${(value as DecryptedDateRangeAnswer['value'])?.from
        ?.hour}, min ${(value as DecryptedDateRangeAnswer['value'])?.from?.minute}) / to (hr ${
        (value as DecryptedDateRangeAnswer['value'])?.to?.hour ?? 0
      }, min ${(value as DecryptedDateRangeAnswer['value'])?.to?.minute ?? 0})`;
    case ItemResponseType.Date: {
      const { day, month, year } = value as DecryptedDateAnswer['value'];
      const calculatedMonth = item?.migratedDate ? month + 1 : month; // for migrated date + 1

      return `date: ${day}/${calculatedMonth}/${year}`;
    }
    case ItemResponseType.Time: {
      const timeValue = value as DecryptedTimeAnswer['value'];
      const hours = timeValue?.hours ?? (answer as DecryptedTimeAnswer)?.hour;
      const minutes = timeValue?.minutes ?? (answer as DecryptedTimeAnswer)?.minute;

      return `time: hr ${hours}, min ${minutes}`;
    }
    case ItemResponseType.Geolocation:
      return `geo: lat (${(value as DecryptedGeolocationAnswer['value'])?.latitude}) / long (${(
        value as DecryptedGeolocationAnswer['value']
      )?.longitude})`;
    case ItemResponseType.Drawing:
      return getMediaFileName(item, 'svg');
    case ItemResponseType.ABTrails:
      return getABTrailsCsvName(index, item.id);
    case ItemResponseType.SingleSelectionPerRow: {
      const rows = activityItem?.responseValues.rows;

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
      const rows = activityItem?.responseValues.rows;

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
      const rows = activityItem?.responseValues.rows;

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
        (value as DecryptedStabilityTrackerAnswerObject).phaseType,
      );
    case ItemResponseType.Flanker:
      return getFlankerCsvName(item);
    default:
      return `${key}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
  }
};
