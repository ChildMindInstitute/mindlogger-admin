import { ActivityItemAnswer } from 'shared/types/answer';
import { ItemResponseType } from 'shared/consts';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { SliderItemResponseValues } from 'shared/state';

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

export const shiftAnswerValues = (answers: SingleMultiSelectionSliderAnswer[]) =>
  answers.map((item) => ({
    ...item,
    answer: {
      ...item.answer,
      value: isValueDefined(item.answer.value) ? +item.answer.value + 1 : item.answer.value,
    },
  }));

export const mapIdToValue = (options: ItemOption[]): Record<string, number> =>
  options.reduce((acc, { id, value }) => ({ ...acc, [id]: value }), {});

export const reduceToAnswerMap = (
  answers: SingleMultiSelectionSliderAnswer[],
): Record<number, SingleMultiSelectionSliderAnswer> =>
  answers.reduce((acc, answer) => {
    const { value } = answer.answer;

    return value === null || value === undefined ? acc : { ...acc, [value]: answer };
  }, {});

export const handleSingleOrMultipleSelection = (
  previousActivityItem: SingleMultiSelectionSliderFormattedResponses,
  formattedActivityItemAnswers: SingleMultiSelectionSliderFormattedResponses,
): SingleMultiSelectionSliderFormattedResponses => {
  const { activityItem, answers } = formattedActivityItemAnswers;
  const previousItemOptions = previousActivityItem.activityItem.responseValues.options;
  const previousActivityItemOptions = getObjectFromList(previousItemOptions);
  const mapperIdValue = mapIdToValue(previousItemOptions);

  let prevAnswers = previousActivityItem.answers;
  let updatedAnswers: SingleMultiSelectionSliderAnswer[] = [];
  const currAnswers = reduceToAnswerMap(answers);

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
};

export const handleSlider = (
  previousActivityItem: SingleMultiSelectionSliderFormattedResponses,
  formattedActivityItemAnswers: SingleMultiSelectionSliderFormattedResponses,
  currActivityItem: ActivityItemAnswer,
) => {
  const { activityItem, answers } =
    formattedActivityItemAnswers as SingleMultiSelectionSliderFormattedResponses;
  const previousResponseValues = previousActivityItem.activityItem.responseValues;
  const currResponseValues = currActivityItem.activityItem
    .responseValues as SliderItemResponseValues;

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
};

export const handlePerRowSelection = (
  previousActivityItem: SingleMultiSelectionPerRowFormattedResponses,
  formattedActivityItemAnswers: SingleMultiSelectionPerRowFormattedResponses,
): SingleMultiSelectionPerRowFormattedResponses => {
  const { activityItem, answers } =
    formattedActivityItemAnswers as SingleMultiSelectionPerRowFormattedResponses;

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
      ...activityItem,
      responseValues,
    },
    answers: updatedAnswers,
  };
};

export const handleSliderRows = (
  previousActivityItem: SliderRowsFormattedResponses,
  formattedActivityItemAnswers: SliderRowsFormattedResponses,
  currActivityItem: ActivityItemAnswer,
): SliderRowsFormattedResponses => {
  const { activityItem, answers } = formattedActivityItemAnswers as SliderRowsFormattedResponses;
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
        currRow.minValue < acc[currRow.id].minValue ? currRow.minValue : acc[currRow.id].minValue,
      maxValue:
        currRow.maxValue > acc[currRow.id].maxValue ? currRow.maxValue : acc[currRow.id].maxValue,
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
};

export const compareActivityItem = (
  prevActivityItem: FormattedResponses,
  currActivityItem: ActivityItemAnswer,
  date: string,
): FormattedResponses => {
  const formattedActivityItemAnswers = formatActivityItemAnswers(currActivityItem, date);
  switch (currActivityItem.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return handleSingleOrMultipleSelection(
        prevActivityItem as SingleMultiSelectionSliderFormattedResponses,
        formattedActivityItemAnswers as SingleMultiSelectionSliderFormattedResponses,
      );
    case ItemResponseType.Slider:
      return handleSlider(
        prevActivityItem as SingleMultiSelectionSliderFormattedResponses,
        formattedActivityItemAnswers as SingleMultiSelectionSliderFormattedResponses,
        currActivityItem,
      );
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return handlePerRowSelection(
        prevActivityItem as SingleMultiSelectionPerRowFormattedResponses,
        formattedActivityItemAnswers as SingleMultiSelectionPerRowFormattedResponses,
      );
    case ItemResponseType.SliderRows:
      return handleSliderRows(
        prevActivityItem as SliderRowsFormattedResponses,
        formattedActivityItemAnswers as SliderRowsFormattedResponses,
        currActivityItem,
      );
    default: {
      const { activityItem, answers } = formattedActivityItemAnswers;

      return {
        activityItem,
        answers: [...(prevActivityItem.answers as TextAnswer[]), ...(answers as TextAnswer[])],
      } as TextFormattedResponses;
    }
  }
};
