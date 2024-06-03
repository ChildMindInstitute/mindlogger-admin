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
  DecryptedTextAnswer,
  DecryptedTimeAnswer,
  ExtendedEvent,
  isMediaAnswerData,
  ResponseValueType,
  UserActionType,
} from 'shared/types';
import { NULL_ANSWER } from 'shared/consts';

import {
  getABTrailsCsvName,
  getFileExtension,
  getFlankerCsvName,
  getMediaFileName,
  getStabilityTrackerCsvName,
} from './getReportName';
import { joinWihComma } from '../joinWihComma';
import { getAnswerValue } from '../getAnswerValue';

const getTimeRangeValue = (
  data: DecryptedDateRangeAnswer['value']['from'] | DecryptedDateRangeAnswer['value']['to'],
  hasFallback = false,
) => {
  const hour = hasFallback ? data?.hour ?? 0 : data?.hour;
  const minute = hasFallback ? data?.minute ?? 0 : data?.minute;

  return `hr ${hour}, min ${minute}`;
};
export const isNullAnswer = (obj: ResponseValueType) =>
  obj === null || (typeof obj === 'object' && Object.keys(obj).length === 0);

export const isTextAnswer = (answer: ResponseValueType): answer is DecryptedTextAnswer =>
  typeof answer === 'string';

export const parseResponseValue = <T extends DecryptedAnswerData>(
  item: T,
  index: number,
  isEvent = false,
) => {
  let answer: ResponseValueType;
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
  answer: ResponseValueType,
) => {
  if (isTextAnswer(answer)) return answer;
  if (isNullAnswer(answer)) return NULL_ANSWER;

  const { activityItem, id: answerId } = item;
  const inputType = activityItem.responseType;
  const answerKeys = Object.keys(answer ?? {});
  const key = answer && answer === Object(answer) ? (answerKeys[0] as keyof AnswerDTO) : undefined;
  const value = getAnswerValue(answer);

  if (!key || (key === 'text' && answerKeys.length < 2)) return '';
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
    case ItemResponseType.TimeRange: {
      const prefix = 'time_range: ';
      const typedValue = value as DecryptedDateRangeAnswer['value'];
      const from = typedValue?.from;
      const to = typedValue?.to;

      if (from === null && to === null) return `${prefix}from (empty) / to (empty)`;
      if (from === null) return `${prefix}from (empty) / to (${getTimeRangeValue(to)})`;
      if (to === null) return `${prefix}from (${getTimeRangeValue(from)}) / to (empty)`;

      return `${prefix}from (${getTimeRangeValue(from)}) / to (${getTimeRangeValue(to, true)})`;
    }
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
    /* 
      Item list as default case:
      - 'singleSelect',
      - 'multiSelect',
      - 'slider',
      - 'numberSelect',
      - 'audioPlayer'
    */
    default: {
      const correctedKey =
        key === 'text' && !!Object.getOwnPropertyDescriptor(answer, 'value') ? 'value' : key;

      return `${correctedKey}: ${Array.isArray(value) ? joinWihComma(value as string[]) : value}`;
    }
  }
};
