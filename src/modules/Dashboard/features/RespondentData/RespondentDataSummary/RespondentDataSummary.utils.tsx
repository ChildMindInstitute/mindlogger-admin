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
import { ActivitySettingsSubscale, SliderItemResponseValues } from 'shared/state/Applet';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import { getObjectFromList } from 'shared/utils';

import {
  ActivityCompletion,
  Answer,
  FormattedActivityItem,
  FormattedAnswer,
  FormattedResponse,
  Identifier,
  ItemOption,
  RespondentAnswerValue,
  RespondentsDataFormValues,
  PerRowSelectionItemOption,
  SimpleAnswerValue,
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
  if (!selectedActivity.hasAnswer) {
    return (
      <>
        <Svg id="chart" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForActivity')}
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

export const getSingleMultiOptionsMapper = (formattedActivityItem: FormattedActivityItem) => {
  const sortedOptions = getSortedOptions(
    formattedActivityItem.responseValues.options as ItemOption[], // options for single/multi selecion
  );

  return sortedOptions.reduce(
    (options: Record<number, number>, option: ItemOption, index: number) => ({
      ...options,
      [option.value]: index,
    }),
    {},
  );
};

const shiftAnswerValues = (answers: Answer<SimpleAnswerValue>[]) =>
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
          value: currentAnswer,
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
): FormattedResponse<RespondentAnswerValue> => {
  const currentActivityItem = currentAnswer.activityItem;
  const { id, name, question, responseType, responseValues } = currentActivityItem;
  const formattedActivityItem = {
    id: id ?? '',
    name,
    question,
    responseType,
    responseValues,
  } as FormattedActivityItem;

  switch (currentAnswer.activityItem.responseType) {
    case ItemResponseType.SingleSelection: {
      const optionsValuesMapper = getSingleMultiOptionsMapper(formattedActivityItem);
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: currentAnswer.activityItem.responseValues.options.map(({ id, text, value }) => ({
            id,
            text,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: optionsValuesMapper[value!],
          })),
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
      };
    }
    case ItemResponseType.MultipleSelection: {
      const optionsValuesMapper = getSingleMultiOptionsMapper(formattedActivityItem);
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: currentAnswer.activityItem.responseValues.options.map(({ id, text, value }) => ({
            id,
            text,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: optionsValuesMapper[value!],
          })),
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
      };
    }
    case ItemResponseType.Slider: {
      const activityItem = {
        ...formattedActivityItem,
        responseValues: {
          options: getSliderOptions(
            currentAnswer.activityItem.responseValues,
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
          responseDataIdentifier: currentAnswer.activityItem.config.responseDataIdentifier,
        },
        answers,
      };
    }
    case ItemResponseType.Date: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        };
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
      };
    }
    case ItemResponseType.TimeRange: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        };
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
      };
    }
    case ItemResponseType.Time: {
      if (!currentAnswer.answer) {
        return {
          activityItem: formattedActivityItem,
          answers: getDefaultEmptyAnswer(date),
        };
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
      };
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
      };
    }
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow: {
      const answers = (currentAnswer.answer as FormattedAnswer<string[]>)?.value?.reduce(
        (
          acc: Record<string, Answer<string | string[]>[]>,
          currentAnswer: string | string[],
          index: number,
        ) => {
          if (!formattedActivityItem?.responseValues?.rows) return acc;
          const currentRow = formattedActivityItem?.responseValues?.rows[index];
          const flattenAnswers = getSingleMultiSelectionPerRowAnswers({
            responseType: formattedActivityItem.responseType,
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
        answers: answers as Record<string, Answer[]>,
      };
    }
    default:
      return {
        activityItem: formattedActivityItem,
        answers: getDefaultEmptyAnswer(date),
      };
  }
};

export const compareActivityItem = (
  prevActivityItem: FormattedResponse,
  currActivityItem: ActivityItemAnswer,
  date: string,
) => {
  const { activityItem, answers } = formatActivityItemAnswers(currActivityItem, date);
  switch (currActivityItem.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection: {
      const prevItemOptions = prevActivityItem.activityItem.responseValues.options as ItemOption[];
      const prevActivityItemOptions = getObjectFromList(prevItemOptions);
      const mapperIdValue = prevItemOptions.reduce(
        (acc: Record<string, number>, { id, value }) => ({
          ...acc,
          [id]: value,
        }),
        {},
      );

      let prevAnswers = prevActivityItem.answers as Answer<SimpleAnswerValue>[];
      let updatedAnswers: Answer<SimpleAnswerValue>[] = [];
      const currAnswers = (answers as Answer<SimpleAnswerValue>[]).reduce(
        (answers: Record<string, Answer>, curr) => {
          const value = curr.answer.value;

          return value === null || value === undefined
            ? answers
            : {
                ...answers,
                [value]: curr,
              };
        },
        {},
      ) as Record<string, Answer<SimpleAnswerValue>>;

      const sortedCurrOptions = getSortedOptions(
        activityItem.responseValues.options as ItemOption[],
      );
      const updatedOptions = sortedCurrOptions.reduce(
        (options: Record<string, ItemOption>, { id, text, value }) => {
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
        answers: [...prevAnswers, ...updatedAnswers],
      };
    }
    case ItemResponseType.Slider: {
      const prevResponseValues = prevActivityItem.activityItem.responseValues;
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
        getObjectFromList(prevResponseValues.options as ItemOption[]),
      );

      return {
        activityItem: {
          ...activityItem,
          responseValues: {
            options: Object.values(sliderOptions),
          },
        },
        answers: [...(prevActivityItem.answers as Answer[]), ...(answers as Answer[])],
      };
    }
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow: {
      const prevActivityItemRows = getObjectFromList(
        prevActivityItem.activityItem.responseValues.rows,
        ({ rowName }) => rowName,
      );

      const prevActivityItemOptions = getObjectFromList(
        prevActivityItem.activityItem.responseValues.options as PerRowSelectionItemOption[],
        ({ text }) => text,
      );

      const updatedRows = (activityItem.responseValues.rows ?? [])?.reduce((rows, currRow) => {
        if (!prevActivityItemRows[currRow.rowName]) {
          rows.push(currRow);
        }

        return rows;
      }, prevActivityItem.activityItem.responseValues.rows || []);

      const updatedOptions = (
        activityItem.responseValues.options as PerRowSelectionItemOption[]
      )?.reduce((options, currOption) => {
        if (!prevActivityItemOptions[currOption.text]) {
          (options as PerRowSelectionItemOption[]).push(currOption);
        }

        return options;
      }, prevActivityItem.activityItem.responseValues.options || []);

      const responseValues = {
        ...prevActivityItem.activityItem.responseValues,
        rows: updatedRows,
        options: updatedOptions,
      };

      const updatedAnswers = Object.entries(
        answers as Record<string, Answer<RespondentAnswerValue>[]>,
      ).reduce(
        (acc: Record<string, Answer<RespondentAnswerValue>[]>, [rowName, answer]) => {
          if (!answer?.length) {
            return acc;
          }

          if (!acc[rowName]) {
            acc[rowName] = answer;

            return acc;
          }

          acc[rowName].push(...answer);

          return acc;
        },
        prevActivityItem.answers as Record<string, Answer<RespondentAnswerValue>[]>,
      );

      return {
        activityItem: {
          ...prevActivityItem.activityItem,
          responseValues,
        },
        answers: updatedAnswers,
      };
    }
    default:
      return {
        activityItem,
        answers: [...(prevActivityItem.answers as Answer[]), ...(answers as Answer[])],
      };
  }
};

export const getFormattedResponses = (activityResponses: ActivityCompletion[]) => {
  let subscalesFrequency = 0;
  const formattedResponses = activityResponses.reduce(
    (
      items: Record<string, FormattedResponse[]>,
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
          const { activityItem, answers } = formatActivityItemAnswers(currentAnswer, endDatetime);
          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
