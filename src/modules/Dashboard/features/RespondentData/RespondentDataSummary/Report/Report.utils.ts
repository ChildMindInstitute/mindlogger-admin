/* eslint-disable no-case-declarations */
import { Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import {
  Item,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectionOption,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';
import {
  ActivityItemAnswer,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { getObjectFromList } from 'shared/utils';
import { isItemUnsupported } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from './Report.const';
import { Identifier } from '../RespondentDataSummary.types';
import {
  ActivityCompletion,
  Answer,
  FormattedActivityItem,
  FormattedResponse,
  ItemOption,
} from './Report.types';

export const getDefaultFilterValues = (versions: Version[]) => {
  const versionsFilter = versions.map(({ version }) => ({ id: version, label: version }));

  return {
    startDateEndDate: [DEFAULT_START_DATE, DEFAULT_END_DATE],
    moreFiltersVisisble: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    versions: versionsFilter,
  };
};

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, mins] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +mins);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = (
  filterByIdentifier = false,
  filterIdentifiers = [] as AutocompleteOption[],
  identifiers = [] as Identifier[],
): string[] | undefined => {
  if (!filterByIdentifier) return;

  return identifiers.reduce(
    (decryptedIdentifiers: string[], { encryptedValue, decryptedValue }: Identifier) => {
      const identifier = filterIdentifiers.find(
        (filterIdentifier) => filterIdentifier.id === decryptedValue,
      );

      return identifier ? [...decryptedIdentifiers, encryptedValue] : decryptedIdentifiers;
    },
    [],
  );
};

const getSliderOptions = (
  { minValue, maxValue }: SliderItemResponseValues,
  itemId: string,
  step = 1,
) => {
  const min = +minValue;
  const max = +maxValue;

  return Array.from({ length: (max - min) / step + 1 }, (_, index) => ({
    id: `${itemId}-${min + index * step}`,
    text: min + index * step,
    value: min + index * step,
  }));
};

const getAnswers = (currentAnswer: ActivityItemAnswer, date: string): Answer[] => {
  switch (currentAnswer.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.Slider:
      const value =
        (currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value !== undefined &&
        (currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value !== null
          ? +(currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value
          : null;

      return [
        {
          answer: {
            value,
            text: null,
          },
          date,
        },
      ];
    case ItemResponseType.MultipleSelection:
      if (!currentAnswer.answer) {
        // return default skipped answer
        return [
          {
            answer: {
              value: null,
              text: null,
            },
            date,
          },
        ];
      }

      return (currentAnswer.answer as DecryptedMultiSelectionAnswer)?.value.map((value) => ({
        answer: {
          value: +value,
          text: null,
        },
        date,
      }));
    default:
      return [
        {
          answer: {
            value: currentAnswer.answer,
            text: null,
          },
          date,
        } as Answer,
      ];
  }
};

const getFormattedActivityItem = (currentActivityItem: Item): FormattedActivityItem => {
  const { id, key, name, question, responseType, responseValues } = currentActivityItem;
  const formattedActivityItem = {
    id: id!,
    key: key!,
    name,
    question,
    responseType,
    responseValues,
  };

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return {
        ...formattedActivityItem,
        responseValues: {
          options: (responseValues as SingleAndMultipleSelectItemResponseValues).options.map(
            ({ id, text, value, score }) => ({ id, text, value: value!, score }),
          ),
        },
      };
    case ItemResponseType.Slider:
      return {
        ...formattedActivityItem,
        responseValues: {
          options: getSliderOptions(
            responseValues as SliderItemResponseValues,
            currentActivityItem.id!,
          ),
        },
      };
    default:
      return formattedActivityItem as FormattedActivityItem;
  }
};

const compareActivityItem = (prevActivityItem: FormattedResponse, currActivityItem: Item) => {
  const formattedActivityItem = getFormattedActivityItem(currActivityItem);
  switch (currActivityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      const prevActivityItemOptions = getObjectFromList(
        prevActivityItem.activityItem.responseValues.options,
      );
      const options = (
        currActivityItem.responseValues as SingleAndMultipleSelectItemResponseValues
      ).options.reduce(
        (
          acc: Record<string, ItemOption>,
          { id, text, value }: SingleAndMultipleSelectionOption,
        ) => ({
          ...acc,
          [id]: {
            id,
            text,
            value: value!,
          },
        }),
        prevActivityItemOptions,
      );

      return {
        ...formattedActivityItem,
        responseValues: {
          ...formattedActivityItem.responseValues,
          options: Object.values(options),
        },
      };
    case ItemResponseType.Slider:
      const prevResponseValues = prevActivityItem.activityItem.responseValues;
      const currResponseValues = currActivityItem.responseValues as SliderItemResponseValues;

      const sliderOptions = getSliderOptions(
        currResponseValues as SliderItemResponseValues,
        currActivityItem.id!,
      ).reduce((acc: Record<string, ItemOption>, currentOption) => {
        if (acc[currentOption.id]) return acc;

        return {
          ...acc,
          [currentOption.id]: currentOption,
        };
      }, getObjectFromList(prevResponseValues.options));

      return {
        ...formattedActivityItem,
        responseValues: {
          options: Object.values(sliderOptions),
        },
      };
    default:
      return formattedActivityItem;
  }
};

export const getFormattedResponses = (activityResponses: ActivityCompletion[]) =>
  activityResponses.reduce(
    (
      items: Record<string, FormattedResponse[]>,
      { decryptedAnswer, endDatetime }: ActivityCompletion,
    ) => {
      let newItems = { ...items };
      decryptedAnswer.forEach((currentAnswer) => {
        const item = items[currentAnswer.activityItem.id!];

        if (!item) {
          const answers = getAnswers(currentAnswer, endDatetime);
          const activityItem = getFormattedActivityItem(currentAnswer.activityItem);
          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: [
              {
                activityItem,
                answers,
              },
            ],
          };

          return;
        }

        const currResponseType = currentAnswer.activityItem.responseType;
        const prevResponseTypes = item.reduce(
          (acc: Record<string, number>, { activityItem }, index: number) => ({
            ...acc,
            [activityItem.responseType]: index,
          }),
          {},
        );

        if (currResponseType in prevResponseTypes) {
          const prevActivityItem = item[prevResponseTypes[currResponseType]];

          const activityItem = compareActivityItem(prevActivityItem, currentAnswer.activityItem);
          const answers = getAnswers(currentAnswer, endDatetime);

          const prevAnswers = prevActivityItem.answers || [];

          const updatedCurrAnswers = [...prevAnswers, ...answers];

          const updatedItem = [...item];
          updatedItem[prevResponseTypes[currResponseType]] = {
            activityItem: {
              ...activityItem,
            },
            answers: updatedCurrAnswers,
          };

          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        const types = [
          ItemResponseType.SingleSelection,
          ItemResponseType.MultipleSelection,
          ItemResponseType.Slider,
        ];

        if (types.includes(currResponseType)) {
          const prevActivityItemIndex = item.findIndex(({ activityItem }) =>
            types.includes(activityItem.responseType),
          );

          if (prevActivityItemIndex < 0) return;

          const prevActivityItem = item[prevActivityItemIndex];

          const maxPrevValue = Math.max(
            ...prevActivityItem.activityItem.responseValues.options.map(({ value }) => +value),
          );

          const currActivityItem = getFormattedActivityItem(currentAnswer.activityItem);
          const currAnswers = getAnswers(currentAnswer, endDatetime);

          const valuesMapper = currActivityItem?.responseValues.options.reduce(
            (acc: Record<number, number>, { value }, index: number) => ({
              ...acc,
              [value]: maxPrevValue + index + 1,
            }),
            {},
          );

          const updatedCurrActivityItem = {
            ...currActivityItem,
            responseValues: {
              options: [
                ...prevActivityItem.activityItem.responseValues.options,
                ...(currActivityItem?.responseValues?.options.map((option) => ({
                  ...option,
                  value: valuesMapper[option.value],
                })) || []),
              ],
            },
          };

          const updatedCurrAnswers = [
            ...prevActivityItem.answers,
            ...currAnswers.map((answerItem) => ({
              ...answerItem,
              answer: {
                ...answerItem.answer,
                value:
                  currResponseType === ItemResponseType.Slider
                    ? answerItem.answer.value
                    : valuesMapper[answerItem.answer.value as number],
              },
            })),
          ];

          const activityItems = [...item];
          activityItems[prevActivityItemIndex] = {
            activityItem: updatedCurrActivityItem,
            answers: updatedCurrAnswers,
          };

          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: activityItems,
          };

          return;
        }

        if (currResponseType === ItemResponseType.Text) {
          const prevActivityItemIndex = item.findIndex(
            ({ activityItem }) => activityItem.responseType === ItemResponseType.Text,
          );

          if (prevActivityItemIndex < 0) {
            const currActivityItem = getFormattedActivityItem(currentAnswer.activityItem);
            const currAnswers = getAnswers(currentAnswer, endDatetime);
            const updatedItem = [...item];
            updatedItem.push({
              activityItem: currActivityItem,
              answers: currAnswers,
            });

            newItems = {
              ...newItems,
              [currentAnswer.activityItem.id!]: updatedItem,
            };

            return;
          }

          const prevActivityItem = item[prevActivityItemIndex];

          const currAnswers = getAnswers(currentAnswer, endDatetime);

          const updatedCurrAnswers = [...(prevActivityItem.answers || []), ...currAnswers];

          const updatedItem = [...item];
          updatedItem[prevActivityItemIndex] = {
            ...prevActivityItem,
            answers: updatedCurrAnswers,
          };

          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        if (isItemUnsupported(currResponseType)) {
          const prevActivityItemIndex = item.findIndex(
            ({ activityItem }) => activityItem.responseType === currResponseType,
          );

          if (prevActivityItemIndex < 0) {
            const currActivityItem = getFormattedActivityItem(currentAnswer.activityItem);
            const currAnswers = getAnswers(currentAnswer, endDatetime);
            const updatedItem = [...item];
            updatedItem.push({
              activityItem: currActivityItem,
              answers: currAnswers,
            });

            newItems = {
              ...newItems,
              [currentAnswer.activityItem.id!]: updatedItem,
            };

            return;
          }
        }
      });

      return newItems;
    },
    {},
  );
