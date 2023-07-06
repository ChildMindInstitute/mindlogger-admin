import { Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import {
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  TextInputConfig,
} from 'shared/state/Applet/Applet.schema';
import {
  ActivityItemAnswer,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { getObjectFromList } from 'shared/utils';

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
    startDate: DEFAULT_START_DATE,
    endDate: DEFAULT_END_DATE,
    moreFiltersVisible: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    versions: versionsFilter,
  };
};

const getDefaultEmptyAnswer = (date: string) => [
  {
    answer: {
      value: null,
      text: null,
    },
    date,
  },
];

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +minutes);

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

const getOptionsMapper = (formattedActivityItem: FormattedActivityItem) =>
  formattedActivityItem.responseValues.options.reduce(
    (options: Record<number, number>, option: ItemOption, index: number) => ({
      ...options,
      [option.value]: index,
    }),
    {},
  );

const compareActivityItem = (
  prevActivityItem: FormattedResponse,
  currActivityItem: ActivityItemAnswer,
  date: string,
) => {
  const { activityItem, answers } = formatActivityItemAnswers(currActivityItem, date);
  switch (currActivityItem.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection: {
      let maxValue = prevActivityItem.activityItem.responseValues.options.length;

      const prevActivityItemOptions = getObjectFromList(
        prevActivityItem.activityItem.responseValues.options,
      );
      const mapperIdValue = prevActivityItem.activityItem.responseValues.options.reduce(
        (acc: Record<string, number>, curr) => ({
          ...acc,
          [curr.id]: curr.value,
        }),
        {},
      );

      const updatedAnswers: Answer[] = [];
      const currAnswers = answers.reduce(
        (answers: Record<string, Answer>, curr) =>
          curr.answer.value === null || curr.answer.value === undefined
            ? answers
            : {
                ...answers,
                [curr.answer.value]: curr,
              },
        {},
      );

      const updatedOptions = activityItem.responseValues.options.reduce(
        (options: Record<string, ItemOption>, { id, text, value }) => {
          if (!options[id]) {
            if (currAnswers[value]) {
              updatedAnswers.push({
                ...currAnswers[value],
                answer: {
                  ...currAnswers[value].answer,
                  value: maxValue,
                },
              });
            }

            const newOptions = {
              ...options,
              [id]: {
                id,
                text,
                value: maxValue,
              },
            };

            maxValue += 1;

            return newOptions;
          }

          if (mapperIdValue[id] === value) {
            if (currAnswers[value]) {
              updatedAnswers.push(currAnswers[value]);
            }

            return {
              ...options,
              [id]: {
                ...options[id],
                text,
              },
            };
          }

          if (currAnswers[value]) {
            updatedAnswers.push({
              ...currAnswers[value],
              answer: {
                ...currAnswers[value].answer,
                value: options[id].value,
              },
            });
          }

          return {
            ...options,
            [id]: {
              ...options[id],
              text,
            },
          };
        },
        prevActivityItemOptions,
      );

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            ...activityItem.responseValues,
            options: Object.values(updatedOptions),
          },
        },
        answers: [...prevActivityItem.answers, ...updatedAnswers],
      };
    }
    case ItemResponseType.Slider: {
      const prevResponseValues = prevActivityItem.activityItem.responseValues;
      const currResponseValues = currActivityItem.activityItem
        .responseValues as SliderItemResponseValues;

      const sliderOptions = getSliderOptions(
        currResponseValues as SliderItemResponseValues,
        currActivityItem.id!,
      ).reduce((options: Record<string, ItemOption>, currentOption) => {
        if (options[currentOption.id]) return options;

        return {
          ...options,
          [currentOption.id]: currentOption,
        };
      }, getObjectFromList(prevResponseValues.options));

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            options: Object.values(sliderOptions),
          },
        },
        answers: [...prevActivityItem.answers, ...answers],
      };
    }
    default:
      return {
        activityItem,
        answers: [...prevActivityItem.answers, ...answers],
      };
  }
};

export const formatActivityItemAnswers = (
  currentAnswer: ActivityItemAnswer,
  date: string,
): FormattedResponse => {
  const currentActivityItem = currentAnswer.activityItem;
  const { id, name, question, responseType, responseValues } = currentActivityItem;
  const formattedActivityItem = {
    id: id!,
    name,
    question,
    responseType,
    responseValues,
  } as FormattedActivityItem;

  switch (currentAnswer.activityItem.responseType) {
    case ItemResponseType.SingleSelection: {
      const optionsValuesMapper = getOptionsMapper(formattedActivityItem);
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: (responseValues as SingleAndMultipleSelectItemResponseValues).options.map(
            ({ id, text, value }) => ({
              id,
              text,
              value: optionsValuesMapper[value!],
            }),
          ),
        },
      };

      const value =
        (currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value !== undefined &&
        (currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value !== null
          ? +(currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value
          : null;

      const answers = [
        {
          answer: {
            value: optionsValuesMapper[value!],
            text: null,
          },
          date,
        },
      ];

      return {
        activityItem,
        answers,
      };
    }
    case ItemResponseType.MultipleSelection: {
      const optionsValuesMapper = getOptionsMapper(formattedActivityItem);
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: (responseValues as SingleAndMultipleSelectItemResponseValues).options.map(
            ({ id, text, value }) => ({ id, text, value: optionsValuesMapper[value!] }),
          ),
        },
      };

      const answers = currentAnswer.answer
        ? (currentAnswer.answer as DecryptedMultiSelectionAnswer)?.value.map((value) => ({
            answer: {
              value: optionsValuesMapper[+value],
              text: null,
            },
            date,
          }))
        : getDefaultEmptyAnswer(date);

      return {
        activityItem,
        answers,
      };
    }
    case ItemResponseType.Slider: {
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: getSliderOptions(
            responseValues as SliderItemResponseValues,
            formattedActivityItem.id!,
          ),
        },
      };
      const value =
        (currentAnswer.answer as DecryptedSliderAnswer)?.value !== undefined &&
        (currentAnswer.answer as DecryptedSliderAnswer)?.value !== null
          ? +(currentAnswer.answer as DecryptedSliderAnswer)?.value
          : null;

      const answers = [
        {
          answer: {
            value,
            text: null,
          },
          date,
        },
      ];

      return {
        activityItem,
        answers,
      };
    }
    case ItemResponseType.Text: {
      const answers = [
        {
          answer: {
            value: currentAnswer.answer as DecryptedTextAnswer,
            text: null,
          },
          date,
        },
      ];

      return {
        activityItem: {
          ...formattedActivityItem,
          responseDataIdentifier: (currentActivityItem.config as TextInputConfig)
            .responseDataIdentifier,
        },
        answers,
      };
    }
    default:
      return {
        activityItem: formattedActivityItem,
        answers: getDefaultEmptyAnswer(date),
      };
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
          const { activityItem, answers } = formatActivityItemAnswers(currentAnswer, endDatetime);
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
          (types: Record<string, number>, { activityItem }, index: number) => ({
            ...types,
            [activityItem.responseType]: index,
          }),
          {},
        );

        if (!(currResponseType in prevResponseTypes)) {
          const { activityItem, answers } = formatActivityItemAnswers(currentAnswer, endDatetime);
          const updatedItem = [...item];
          updatedItem.push({
            activityItem,
            answers,
          });

          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        const prevActivityItem = item[prevResponseTypes[currResponseType]];

        const { activityItem, answers } = compareActivityItem(
          prevActivityItem,
          currentAnswer,
          endDatetime,
        );

        const updatedItem = [...item];
        updatedItem[prevResponseTypes[currResponseType]] = {
          activityItem,
          answers,
        };

        newItems = {
          ...newItems,
          [currentAnswer.activityItem.id!]: updatedItem,
        };

        return;
      });

      return newItems;
    },
    {},
  );
