import { ItemResponseType } from 'shared/consts';
import { SliderItemResponseValues } from 'shared/state/Applet/Applet.schema';
import { getObjectFromList } from 'shared/utils';
import {
  ActivityItemAnswer,
  AnswerDTO,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
  DecryptedTimeAnswer,
  DecryptedNumberSelectionAnswer,
  DecryptedDateAnswer,
} from 'shared/types';

import {
  Answer,
  FormattedActivityItem,
  FormattedResponse,
  ItemOption,
} from '../../RespondentData.types';
import { getDateFormattedResponse } from '../../RespondentData.utils';
import { DEFAULT_DATE_MAX } from './Report.const';

export const isValueDefined = <T = string | number | (string | number)[] | null>(
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

const shiftAnswerValues = (answers: Answer[]) =>
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

export const getOptionsMapper = (formattedActivityItem: FormattedActivityItem) => {
  const sortedOptions = getSortedOptions(formattedActivityItem.responseValues.options);

  return sortedOptions.reduce(
    (options: Record<number, number>, option: ItemOption, index: number) => ({
      ...options,
      [option.value]: index,
    }),
    {},
  );
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
      const prevActivityItemOptions = getObjectFromList(
        prevActivityItem.activityItem.responseValues.options,
      );
      const mapperIdValue = prevActivityItem.activityItem.responseValues.options.reduce(
        (acc: Record<string, number>, { id, value }) => ({
          ...acc,
          [id]: value,
        }),
        {},
      );

      let prevAnswers: Answer[] = prevActivityItem.answers;
      let updatedAnswers: Answer[] = [];
      const currAnswers = answers.reduce((answers: Record<string, Answer>, curr) => {
        const value = curr.answer.value;

        return value === null || value === undefined
          ? answers
          : {
              ...answers,
              [value]: curr,
            };
      }, {});

      const sortedCurrOptions = getSortedOptions(activityItem.responseValues.options);
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
    id: id ?? '',
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
      const optionsValuesMapper = getOptionsMapper(formattedActivityItem);
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
    default:
      return {
        activityItem: formattedActivityItem,
        answers: getDefaultEmptyAnswer(date),
      };
  }
};

export const getLatestReportUrl = (base64Str: string) => `data:application/pdf;base64,${base64Str}`;
