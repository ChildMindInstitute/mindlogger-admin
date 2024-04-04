import isEqual from 'lodash.isequal';

import { FormattedAssessmentAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { AssessmentFormItem } from '../Feedback.types';

export const formatToNumberArray = (stringArray: string[]) => stringArray.map((item) => +item);

export const hasAnswerValue = (value: string | number | string[]) => {
  if (Array.isArray(value)) return !!value.length;

  return !!value?.toString().length;
};

export const getUpdatedValues = (
  defaultValues: AssessmentFormItem[],
  currentItem: AssessmentFormItem,
  prevItemIds: string[],
  updatedItemIds: string[],
) => {
  const isEditedBefore = prevItemIds.includes(currentItem.itemId);
  const defaultItem = defaultValues.find(({ itemId }) => itemId === currentItem.itemId);
  const itemIds = [...updatedItemIds, defaultItem?.itemId as string];
  const defaulltValues = {
    edited: null,
    itemIds,
  };

  // multiple selection item
  if (Array.isArray(defaultItem?.answers)) {
    const areArraysEqual = isEqual(
      formatToNumberArray(defaultItem?.answers as string[]).sort(),
      formatToNumberArray(currentItem.answers as string[]).sort(),
    );

    return isEditedBefore
      ? {
          edited: areArraysEqual ? defaultItem?.edited : new Date().getTime(),
          itemIds,
        }
      : defaulltValues;
  }

  // single selection / slider items
  const areValuesEqual = defaultItem?.answers === currentItem.answers;

  return isEditedBefore
    ? {
        edited: areValuesEqual ? defaultItem?.edited : new Date().getTime(),
        itemIds,
      }
    : defaulltValues;
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
      const { edited, itemIds } = getUpdatedValues(
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

export const getAssessmentVersion = (isLastVersion: boolean, assessmentVersions: string[]) =>
  isLastVersion && assessmentVersions.length > 1 ? assessmentVersions[1] : assessmentVersions[0];
