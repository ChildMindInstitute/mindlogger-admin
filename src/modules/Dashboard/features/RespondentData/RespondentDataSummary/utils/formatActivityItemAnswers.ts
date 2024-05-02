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
} from 'shared/types/answer';
import { ItemResponseType } from 'shared/consts';
import { MultiSelectItem, SingleSelectItem, SliderItem, TextItem } from 'shared/state';

import {
  DateFormattedResponses,
  FormattedActivityItem,
  FormattedAnswer,
  FormattedResponses,
  NumberSelectionFormattedResponses,
  SingleMultiSelectionPerRowAnswer,
  SingleMultiSelectionPerRowFormattedResponses,
  SingleMultiSelectionPerRowItemResponseValues,
  SingleMultiSelectionSliderFormattedResponses,
  SingleMultiSelectionSliderItemResponseValues,
  SliderRowsAnswer,
  SliderRowsFormattedResponses,
  SliderRowsItemResponseValues,
  TextAnswer,
  TextFormattedResponses,
  TimeFormattedResponses,
  TimeRangeFormattedResponses,
} from '../../RespondentData.types';
import { getDateFormattedResponse, getTimeRangeResponse } from '../../RespondentData.utils';
import { DEFAULT_DATE_MAX } from '../RespondentDataSummary.const';
import { isValueDefined } from './isValueDefined';
import { GetSingleMultiSelectionPerRowAnswers } from '../RespondentDataSummary.types';
import { getSortedOptions } from './getSortedOptions';
import { getSliderOptions } from './getSliderOptions';

const getDefaultEmptyAnswer = (date: string) => [
  {
    answer: {
      value: null,
      text: null,
    },
    date,
  },
];

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
  const { id, name, question, responseType, responseValues, order } = currentActivityItem;
  const formattedActivityItem = {
    id: id ?? '',
    name,
    question,
    responseType,
    responseValues,
    order,
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
