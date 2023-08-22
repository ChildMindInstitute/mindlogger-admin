import isEqual from 'lodash.isequal';

import { FormattedAssessmentAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { AssessmentFormItem } from '../Feedback.types';

export const formatToNumberArray = (stringArray: string[]) => stringArray.map((item) => +item);

export const checkAnswerValue = (value: string | number | string[]) => {
  if (Array.isArray(value)) return !value.length;

  return !value?.toString().length;
};

export const getEditedValue = (
  defaultValues: AssessmentFormItem[],
  currentItem: AssessmentFormItem,
  prevItemIds: string[],
  updatedItemIds: string[],
) => {
  const isEditedBefore = prevItemIds.includes(currentItem.itemId);
  const defaultItem = defaultValues.find(({ itemId }) => itemId === currentItem.itemId);

  // multiple selection item
  if (Array.isArray(defaultItem?.answers)) {
    let edited = null;
    const areArraysEqual = isEqual(
      formatToNumberArray(defaultItem?.answers as string[]).sort(),
      formatToNumberArray(currentItem.answers as string[]).sort(),
    );

    if (isEditedBefore) {
      edited = areArraysEqual ? defaultItem?.edited : new Date().getTime();
    }

    return {
      edited,
      itemIds: [...updatedItemIds, defaultItem?.itemId as string],
    };
  }

  // single selection / slider items
  let edited = null;
  const areValuesEqual = defaultItem?.answers === currentItem.answers;

  if (isEditedBefore) {
    edited = areValuesEqual ? defaultItem?.edited : new Date().getTime();
  }

  return {
    edited,
    itemIds: [...updatedItemIds, defaultItem?.itemId as string],
  };
};

export const formatAssessmentAnswers = (
  defaultValues: AssessmentFormItem[],
  assessmentItems: AssessmentFormItem[],
  prevItemIds: string[],
) => {
  const { answers, updatedItemIds } = assessmentItems.reduce(
    (
      formattedAssessmentAnswers: {
        answers: FormattedAssessmentAnswer[];
        updatedItemIds: string[];
      },
      item,
    ) => {
      const { edited, itemIds } = getEditedValue(
        defaultValues,
        item,
        prevItemIds,
        formattedAssessmentAnswers.updatedItemIds,
      );

      return {
        answers: [
          ...formattedAssessmentAnswers.answers,
          {
            answer: {
              value: item.answers,
              edited,
            },
            itemId: item.itemId,
          } as FormattedAssessmentAnswer,
        ],
        updatedItemIds: itemIds,
      };
    },
    {
      answers: [],
      updatedItemIds: [],
    },
  );

  return { answers, updatedItemIds };
};
