import { UseFormSetValue } from 'react-hook-form';

import i18n from 'i18n';
import { DatavizActivity } from 'api';
import { Svg } from 'shared/components/Svg';
import {
  ActivityItemAnswer,
  AnswerDTO,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedMultiSelectionAnswer,
  DecryptedNumberSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
  DecryptedTimeAnswer,
  ElementType,
} from 'shared/types';
import { StyledTitleLarge, theme, variables } from 'shared/styles';
import {
  ActivitySettingsSubscale,
  MultiSelectItem,
  SingleSelectItem,
  SliderItem,
  SliderItemResponseValues,
  TextItem,
} from 'shared/state/Applet';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import { getObjectFromList } from 'shared/utils';

import {
  ActivityCompletion,
  FormattedActivityItem,
  FormattedAnswer,
  FormattedResponses,
  Identifier,
  ItemOption,
  RespondentsDataFormValues,
  PerRowSelectionItemOption,
  NumberSelectionFormattedResponses,
  SingleMultiSelectionSliderFormattedResponses,
  TimeRangeFormattedResponses,
  SingleMultiSelectionPerRowFormattedResponses,
  SingleMultiSelectionSliderItemResponseValues,
  SingleMultiSelectionPerRowItemResponseValues,
  TextAnswer,
  TextFormattedResponses,
  DateFormattedResponses,
  TimeFormattedResponses,
  SingleMultiSelectionPerRowAnswer,
  SingleMultiSelectionSliderAnswer,
  SliderRowsFormattedResponses,
  SliderRowsAnswer,
  Answer,
  SliderRowsItemResponseValues,
} from '../RespondentData.types';
import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from '../RespondentData.const';
import { getDateFormattedResponse, getTimeRangeResponse } from '../RespondentData.utils';
import { DEFAULT_DATE_MAX } from './RespondentDataSummary.const';
import { GetSingleMultiSelectionPerRowAnswers } from './RespondentDataSummary.types';

export const getEmptyState = (selectedActivity: DatavizActivity | null) => {
  const { t } = i18n;

  if (!selectedActivity) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('selectTheActivityToReview')}
        </StyledTitleLarge>
      </>
    );
  }
  if (selectedActivity.isPerformanceTask) {
    return (
      <>
        <Svg id="confused" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('datavizNotSupportedForPerformanceTasks')}
        </StyledTitleLarge>
      </>
    );
  }
};

export const getUniqueIdentifierOptions = (identifiers: Identifier[]) => {
  const uniqueIdentifiersSet = new Set<string>();

  return identifiers.reduce((uniqueIdentifiers: AutocompleteOption[], identifierItem) => {
    if (!identifierItem) return uniqueIdentifiers;

    const { decryptedValue } = identifierItem;

    if (!uniqueIdentifiersSet.has(decryptedValue)) {
      uniqueIdentifiersSet.add(decryptedValue);

      return [
        ...uniqueIdentifiers,
        {
          label: decryptedValue,
          id: decryptedValue,
        },
      ];
    }

    return uniqueIdentifiers;
  }, []);
};

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

export const isValueDefined = <T extends string | number | (string | number)[] | null>(
  value?: T,
): value is NonNullable<T> => value !== null && value !== undefined;

export const isAnswerTypeCorrect = (answer: AnswerDTO, responseType: ItemResponseType) => {
  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.Slider: {
      return (
        typeof (answer as DecryptedSingleSelectionAnswer)?.value === 'number' &&
        ((answer as DecryptedSingleSelectionAnswer)?.value as number) >= 0
      );
    }
    case ItemResponseType.MultipleSelection: {
      return (
        Array.isArray((answer as DecryptedMultiSelectionAnswer)?.value) &&
        (answer as DecryptedMultiSelectionAnswer)?.value.every((item) => typeof item === 'number')
      );
    }
    case ItemResponseType.Text: {
      return typeof (answer as DecryptedTextAnswer) === 'string';
    }
  }
};

const getSortedOptions = (options: ItemOption[]) => options.sort((a, b) => b.value - a.value);

export const getSliderOptions = (
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

export const getSingleMultiOptionsMapper = (
  formattedActivityItem: FormattedActivityItem<SingleMultiSelectionSliderItemResponseValues>,
) => {
  const sortedOptions = getSortedOptions(formattedActivityItem.responseValues.options);

  return sortedOptions.reduce(
    (options: Record<number, number>, option, index) => ({
      ...options,
      [option.value]: index,
    }),
    {},
  );
};

const shiftAnswerValues = (answers: SingleMultiSelectionSliderAnswer[]) =>
  answers.map((item) => ({
    ...item,
    answer: {
      ...item.answer,
      value: isValueDefined(item.answer.value) ? +item.answer.value + 1 : item.answer.value,
    },
  }));

const getDefaultEmptyAnswer = (date: string) => [
  {
    answer: {
      value: null,
      text: null,
    },
    date,
  },
];

export const getSingleMultiSelectionPerRowAnswers = ({
  responseType,
  currentAnswer,
  date,
}: GetSingleMultiSelectionPerRowAnswers) => {
  if (responseType === ItemResponseType.SingleSelectionPerRow) {
    return [
      {
        answer: {
          value: currentAnswer as string | null,
          text: null,
        },
        date,
      },
    ];
  }

  return (currentAnswer as string[])?.map((value) => ({
    answer: {
      value,
      text: null,
    },
    date,
  }));
};

export const formatActivityItemAnswers = (
  currentAnswer: ActivityItemAnswer,
  date: string,
): FormattedResponses => {
  const currentActivityItem = currentAnswer.activityItem;
  const { id, name, question, responseType, responseValues } = currentActivityItem;
  const formattedActivityItem = {
    id: id ?? '',
    name,
    question,
    responseType,
    responseValues,
  };

  switch (currentActivityItem.responseType) {
    case ItemResponseType.SingleSelection: {
      const optionsValuesMapper = getSingleMultiOptionsMapper(
        formattedActivityItem as FormattedActivityItem<SingleMultiSelectionSliderItemResponseValues>,
      );
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: (currentActivityItem as SingleSelectItem).responseValues.options.map(
            ({ id, text, value }) => ({
              id,
              text,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              value: optionsValuesMapper[value!],
            }),
          ),
        },
      };

      const isValueCorrect =
        isValueDefined((currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value) &&
        isAnswerTypeCorrect(currentAnswer.answer, ItemResponseType.SingleSelection);

      const value = isValueCorrect
        ? optionsValuesMapper[
            (currentAnswer.answer as DecryptedSingleSelectionAnswer)?.value as number
          ]
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
      } as SingleMultiSelectionSliderFormattedResponses;
    }
    case ItemResponseType.MultipleSelection: {
      const optionsValuesMapper = getSingleMultiOptionsMapper(
        formattedActivityItem as FormattedActivityItem<SingleMultiSelectionSliderItemResponseValues>,
      );
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: (currentActivityItem as MultiSelectItem)?.responseValues.options.map(
            ({ id, text, value }) => ({
              id,
              text,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              value: optionsValuesMapper[value!],
            }),
          ),
        },
      };

      const isValueCorrect =
        isValueDefined((currentAnswer.answer as DecryptedMultiSelectionAnswer)?.value) &&
        isAnswerTypeCorrect(currentAnswer.answer, ItemResponseType.MultipleSelection);

      const answers = isValueCorrect
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
      } as SingleMultiSelectionSliderFormattedResponses;
    }
    case ItemResponseType.Slider: {
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: getSliderOptions(
            (currentActivityItem as SliderItem).responseValues,
            formattedActivityItem.id ?? '',
          ),
        },
      };

      const isValueCorrect =
        isValueDefined((currentAnswer.answer as DecryptedSliderAnswer)?.value) &&
        isAnswerTypeCorrect(currentAnswer.answer, ItemResponseType.Slider);

      const value = isValueCorrect ? (currentAnswer.answer as DecryptedSliderAnswer)?.value : null;

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
      } as SingleMultiSelectionSliderFormattedResponses;
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
      ] as TextAnswer[];

      return {
        activityItem: {
          ...formattedActivityItem,
          responseDataIdentifier: (currentActivityItem as TextItem).config.responseDataIdentifier,
        },
        answers,
      } as TextFormattedResponses;
    }
    case ItemResponseType.Date: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        } as DateFormattedResponses;
      }

      return {
        activityItem: formattedActivityItem,
        answers: [
          {
            answer: {
              value: getDateFormattedResponse(currentAnswer.answer as DecryptedDateAnswer),
              text: null,
            },
            date,
          },
        ],
      } as DateFormattedResponses;
    }
    case ItemResponseType.TimeRange: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        } as TimeRangeFormattedResponses;
      }

      return {
        activityItem: formattedActivityItem,
        answers: [
          {
            answer: {
              value: getTimeRangeResponse(currentAnswer.answer as DecryptedDateRangeAnswer),
              text: null,
            },
            date,
          },
        ],
      } as TimeRangeFormattedResponses;
    }
    case ItemResponseType.Time: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        } as TimeFormattedResponses;
      }

      const answer = currentAnswer.answer as DecryptedTimeAnswer;

      const hours = answer.value?.hours ?? answer.hour ?? 0;
      const minutes = answer.value?.minutes ?? answer.minute ?? 0;

      const fullDateValue = new Date(DEFAULT_DATE_MAX);
      fullDateValue.setHours(hours);
      fullDateValue.setMinutes(minutes);

      const answers = [
        {
          answer: {
            value: fullDateValue.getTime(),
            text: null,
          },
          date,
        },
      ];

      return {
        activityItem: formattedActivityItem,
        answers,
      } as TimeFormattedResponses;
    }
    case ItemResponseType.NumberSelection: {
      return {
        activityItem: formattedActivityItem,
        answers: [
          {
            answer: {
              value: (currentAnswer.answer as DecryptedNumberSelectionAnswer)?.value ?? null,
              text: null,
            },
            date,
          },
        ],
      } as NumberSelectionFormattedResponses;
    }
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow: {
      const currAnswer = currentAnswer.answer as FormattedAnswer<
        (string | string[] | null)[]
      > | null;
      if (!currAnswer) {
        return {
          activityItem: formattedActivityItem,
          answers: {},
        } as SingleMultiSelectionPerRowFormattedResponses;
      }

      const value = (currAnswer.value as (string | string[] | null)[]) ?? [];
      const answers = value.reduce(
        (
          acc: SingleMultiSelectionPerRowAnswer,
          currentAnswer: string | string[] | null,
          index: number,
        ) => {
          const activityItem =
            formattedActivityItem as FormattedActivityItem<SingleMultiSelectionPerRowItemResponseValues>;
          if (!activityItem?.responseValues?.rows) return acc;
          const currentRow = activityItem.responseValues.rows[index];
          const flattenAnswers = getSingleMultiSelectionPerRowAnswers({
            responseType: activityItem.responseType,
            currentAnswer,
            date,
          });
          if (!flattenAnswers?.length) {
            return acc;
          }

          if (!acc[currentRow.rowName]) {
            acc[currentRow.rowName] = flattenAnswers;

            return acc;
          }

          acc[currentRow.rowName].push(...flattenAnswers);

          return acc;
        },
        {},
      );

      return {
        activityItem: formattedActivityItem,
        answers,
      } as SingleMultiSelectionPerRowFormattedResponses;
    }
    case ItemResponseType.SliderRows: {
      const currAnswer = currentAnswer.answer as FormattedAnswer<(number[] | null)[]> | null;
      if (!currAnswer) {
        return {
          activityItem: formattedActivityItem,
          answers: {},
        } as SliderRowsFormattedResponses;
      }

      const value = (currAnswer.value as (number[] | null)[]) ?? [];
      const answers = value.reduce(
        (acc: SliderRowsAnswer, currentAnswer: number[] | null, index: number) => {
          const activityItem =
            formattedActivityItem as FormattedActivityItem<SliderRowsItemResponseValues>;
          if (!activityItem?.responseValues?.rows) return acc;
          const currentRow = activityItem.responseValues.rows[index];
          const answer = [
            {
              answer: {
                value: currentAnswer as number | null,
                text: null,
              },
              date,
            },
          ];

          if (!answer?.length) {
            return acc;
          }

          if (!acc[currentRow.id]) {
            acc[currentRow.id] = answer;

            return acc;
          }

          acc[currentRow.id].push(...answer);

          return acc;
        },
        {},
      );

      return {
        activityItem: formattedActivityItem,
        answers,
      } as SliderRowsFormattedResponses;
    }
    default:
      return {
        activityItem: formattedActivityItem,
        answers: getDefaultEmptyAnswer(date),
      } as FormattedResponses;
  }
};

export const compareActivityItem = (
  prevActivityItem: FormattedResponses,
  currActivityItem: ActivityItemAnswer,
  date: string,
): FormattedResponses => {
  const formattedActivityItemAnswers = formatActivityItemAnswers(currActivityItem, date);
  switch (currActivityItem.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection: {
      const { activityItem, answers } =
        formattedActivityItemAnswers as SingleMultiSelectionSliderFormattedResponses;
      const previousActivityItem = prevActivityItem as SingleMultiSelectionSliderFormattedResponses;
      const previousItemOptions = previousActivityItem.activityItem.responseValues.options;
      const previousActivityItemOptions = getObjectFromList(previousItemOptions);
      const mapperIdValue = previousItemOptions.reduce(
        (acc: Record<string, number>, { id, value }) => ({
          ...acc,
          [id]: value,
        }),
        {},
      );

      let prevAnswers = previousActivityItem.answers;
      let updatedAnswers: SingleMultiSelectionSliderAnswer[] = [];
      const currAnswers = answers.reduce(
        (answers: Record<number, SingleMultiSelectionSliderAnswer>, curr) => {
          const value = curr.answer.value;

          return value === null || value === undefined
            ? answers
            : {
                ...answers,
                [value]: curr,
              };
        },
        {},
      );

      const sortedCurrOptions = getSortedOptions(activityItem.responseValues.options);
      const updatedOptions = sortedCurrOptions.reduce((options, { id, text, value }) => {
        if (!options[id]) {
          // If there is a new option in the new version, we should display them in the same order as in the builder
          // To add a new option at the bottom of the axis, we have to shift the values by 1 in the previous ones
          // And also update the values in the answers

          updatedAnswers = shiftAnswerValues(updatedAnswers);

          if (currAnswers[value]) {
            updatedAnswers.push({
              ...currAnswers[value],
              answer: {
                ...currAnswers[value].answer,
                value: 0,
              },
            });
          }

          const newOptions = Object.keys(options).reduce(
            (updatedOptions, id) => ({
              ...updatedOptions,
              [id]: {
                ...updatedOptions[id],
                value: updatedOptions[id].value + 1,
              },
            }),
            options,
          );

          prevAnswers = shiftAnswerValues(prevAnswers);

          return {
            ...newOptions,
            [id]: {
              id,
              text,
              value: 0,
            },
          };
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
      }, previousActivityItemOptions);

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            ...activityItem.responseValues,
            options: Object.values(updatedOptions),
          },
        },
        answers: [...prevAnswers, ...updatedAnswers],
      };
    }
    case ItemResponseType.Slider: {
      const { activityItem, answers } =
        formattedActivityItemAnswers as SingleMultiSelectionSliderFormattedResponses;
      const previousActivityItem = prevActivityItem as SingleMultiSelectionSliderFormattedResponses;
      const previousResponseValues = previousActivityItem.activityItem.responseValues;
      const currResponseValues = currActivityItem.activityItem.responseValues;

      const sliderOptions = getSliderOptions(
        currResponseValues,
        currActivityItem.activityItem.id ?? '',
      ).reduce(
        (options: Record<string, ItemOption>, currentOption) => {
          if (options[currentOption.id]) return options;

          return {
            ...options,
            [currentOption.id]: currentOption,
          };
        },
        getObjectFromList(previousResponseValues.options as ItemOption[]),
      );

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            options: Object.values(sliderOptions),
          },
        },
        answers: [...previousActivityItem.answers, ...answers],
      };
    }
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow: {
      const { activityItem, answers } =
        formattedActivityItemAnswers as SingleMultiSelectionPerRowFormattedResponses;
      const previousActivityItem = prevActivityItem as SingleMultiSelectionPerRowFormattedResponses;

      const prevActivityItemRows = getObjectFromList(
        previousActivityItem.activityItem.responseValues.rows,
        ({ rowName }) => rowName,
      );

      const previousActivityItemOptions = getObjectFromList(
        previousActivityItem.activityItem.responseValues.options as PerRowSelectionItemOption[],
        ({ text }) => text,
      );

      const updatedRows = (activityItem.responseValues.rows ?? [])?.reduce((rows, currRow) => {
        if (!prevActivityItemRows[currRow.rowName]) {
          rows.push(currRow);
        }

        return rows;
      }, previousActivityItem.activityItem.responseValues.rows || []);

      const updatedOptions = (
        activityItem.responseValues.options as PerRowSelectionItemOption[]
      )?.reduce((options, currOption) => {
        if (!previousActivityItemOptions[currOption.text]) {
          (options as PerRowSelectionItemOption[]).push(currOption);
        }

        return options;
      }, previousActivityItem.activityItem.responseValues.options || []);

      const responseValues = {
        ...previousActivityItem.activityItem.responseValues,
        rows: updatedRows,
        options: updatedOptions,
      };

      const updatedAnswers = Object.entries(answers).reduce((acc, [rowName, answer]) => {
        if (!answer?.length) {
          return acc;
        }

        if (!acc[rowName]) {
          acc[rowName] = answer;

          return acc;
        }

        acc[rowName].push(...answer);

        return acc;
      }, previousActivityItem.answers);

      return {
        activityItem: {
          ...previousActivityItem.activityItem,
          responseValues,
        },
        answers: updatedAnswers,
      };
    }
    case ItemResponseType.SliderRows: {
      const { activityItem, answers } =
        formattedActivityItemAnswers as SliderRowsFormattedResponses;
      const previousActivityItem = prevActivityItem as SliderRowsFormattedResponses;
      const previousResponseValues = previousActivityItem.activityItem
        .responseValues as SliderRowsItemResponseValues;
      const currResponseValues = currActivityItem.activityItem
        .responseValues as SliderRowsItemResponseValues;

      const previousIdRow = getObjectFromList(previousResponseValues.rows);

      const updatedPreviousIdRow = currResponseValues.rows.reduce((acc, currRow) => {
        if (!acc[currRow.id]) {
          return {
            ...acc,
            [currRow.id]: currRow,
          };
        }

        const updatedRow = {
          ...currRow,
          minValue:
            currRow.minValue < acc[currRow.id].minValue
              ? currRow.minValue
              : acc[currRow.id].minValue,
          maxValue:
            currRow.maxValue > acc[currRow.id].maxValue
              ? currRow.maxValue
              : acc[currRow.id].maxValue,
        };

        return {
          ...acc,
          [currRow.id]: updatedRow,
        };
      }, previousIdRow);

      const updatedAnswers = Object.entries(answers).reduce(
        (acc: SliderRowsAnswer, [rowId, currAnswer]: [string, Answer<number>[]]) => {
          if (!acc[rowId]) {
            return {
              ...acc,
              [rowId]: currAnswer,
            };
          }

          const updatedAnswers = {
            ...acc,
            [rowId]: [...acc[rowId], ...currAnswer],
          };

          return updatedAnswers;
        },
        previousActivityItem.answers,
      );

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            rows: Object.values(updatedPreviousIdRow),
          },
        },
        answers: updatedAnswers,
      };
    }
    default: {
      const { activityItem, answers } = formattedActivityItemAnswers;

      return {
        activityItem,
        answers: [...(prevActivityItem.answers as TextAnswer[]), ...(answers as TextAnswer[])],
      } as TextFormattedResponses;
    }
  }
};

export const getFormattedResponses = (activityResponses: ActivityCompletion[]) => {
  let subscalesFrequency = 0;
  const formattedResponses = activityResponses.reduce(
    (
      items: Record<string, FormattedResponses[]>,
      { decryptedAnswer, endDatetime, subscaleSetting }: ActivityCompletion,
    ) => {
      if (subscaleSetting?.subscales?.length) {
        subscalesFrequency++;
      }
      const subscalesItems = subscaleSetting?.subscales?.reduce(
        (items: string[], subscale: ActivitySettingsSubscale) => {
          subscale?.items?.forEach((item) => {
            item.type === ElementType.Item && !items.includes(item.name) && items.push(item.name);
          });

          return items;
        },
        [],
      );

      let newItems = { ...items };
      decryptedAnswer.forEach((currentAnswer) => {
        if (subscalesItems?.includes(currentAnswer.activityItem.name)) return items;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = items[currentAnswer.activityItem.id!];

        if (!item) {
          const formattedActivityItemAnswers = formatActivityItemAnswers(
            currentAnswer,
            endDatetime,
          );
          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: [formattedActivityItemAnswers],
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
          const formattedActivityItemAnswers = formatActivityItemAnswers(
            currentAnswer,
            endDatetime,
          );
          const updatedItem = [...item];
          updatedItem.push(formattedActivityItemAnswers);

          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        const prevActivityItem = item[prevResponseTypes[currResponseType]];

        const formattedActivityItemAnswers = compareActivityItem(
          prevActivityItem,
          currentAnswer,
          endDatetime,
        );

        const updatedItem = [...item];
        updatedItem[prevResponseTypes[currResponseType]] = formattedActivityItemAnswers;

        newItems = {
          ...newItems,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          [currentAnswer.activityItem.id!]: updatedItem,
        };

        return;
      });

      return newItems;
    },
    {},
  );

  return {
    subscalesFrequency,
    formattedResponses,
  };
};

export const setDefaultFormValues = (setValue: UseFormSetValue<RespondentsDataFormValues>) => {
  setValue('startDate', DEFAULT_START_DATE);
  setValue('endDate', DEFAULT_END_DATE);
  setValue('startTime', DEFAULT_START_TIME);
  setValue('endTime', DEFAULT_END_TIME);
  setValue('filterByIdentifier', false);
  setValue('identifier', []);
};

export const getActivityWithLatestAnswer = (
  activities: DatavizActivity[],
): DatavizActivity | null =>
  activities?.reduce((prev: null | DatavizActivity, current) => {
    if (!current.hasAnswer || !current.lastAnswerDate) {
      return prev;
    }

    if (!prev || (prev?.lastAnswerDate && prev.lastAnswerDate < current.lastAnswerDate)) {
      return current;
    }

    return prev;
  }, null);
