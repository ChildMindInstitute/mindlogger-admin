import { ActivityItemAnswer } from 'shared/types/answer';
import { ItemResponseType } from 'shared/consts';
import { getObjectFromList } from 'shared/utils/getObjectFromList';

import {
  Answer,
  FormattedResponses,
  ItemOption,
  PerRowSelectionItemOption,
  SingleMultiSelectionPerRowFormattedResponses,
  SingleMultiSelectionSliderAnswer,
  SingleMultiSelectionSliderFormattedResponses,
  SliderRowsAnswer,
  SliderRowsFormattedResponses,
  SliderRowsItemResponseValues,
  TextAnswer,
  TextFormattedResponses,
} from '../../RespondentData.types';
import { isValueDefined } from './isValueDefined';
import { getSortedOptions } from './getSortedOptions';
import { formatActivityItemAnswers } from './formatActivityItemAnswers';
import { getSliderOptions } from './getSliderOptions';

const shiftAnswerValues = (answers: SingleMultiSelectionSliderAnswer[]) =>
  answers.map((item) => ({
    ...item,
    answer: {
      ...item.answer,
      value: isValueDefined(item.answer.value) ? +item.answer.value + 1 : item.answer.value,
    },
  }));

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
