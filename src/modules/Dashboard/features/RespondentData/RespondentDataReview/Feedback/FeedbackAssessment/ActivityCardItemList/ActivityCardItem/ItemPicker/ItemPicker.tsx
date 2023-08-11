import { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import isEqual from 'lodash.isequal';

import { ItemResponseType } from 'shared/consts';
import {
  MultipleSelectionController,
  SingleSelectionController,
  SliderController,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessmentControllers';
import {
  MultiSelectItemAnswer,
  SingleSelectItemAnswer,
  SliderItemAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { getActivityItemIndex } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessmentControllers/AssesmentControllers.utils';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.types';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/context';

import { ItemPickerProps } from './ItemPicker.types';
import { updateItemIds } from './ItemPicker.utils';

export const ItemPicker = ({ activityItem, isDisabled }: ItemPickerProps) => {
  const { itemIds, setItemIds } = useContext(RespondentDataReviewContext);
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { defaultValues },
  } = useFormContext<FeedbackForm>();
  const { assessmentItems } = getValues();

  const activityItemIndex = getActivityItemIndex(
    assessmentItems,
    activityItem.activityItem.id || '',
  );

  const controlName = `assessmentItems.${activityItemIndex}.answers` as const;
  const watchAnswer = watch(controlName);
  const edited = `assessmentItems.${activityItemIndex}.edited` as const;

  const formatToNumberArray = (stringArray: string[]) => stringArray.map((item) => +item);

  const checkEditedValue = (): number | null => {
    const defaultAnswerValue = defaultValues?.assessmentItems?.[activityItemIndex]?.answers;
    const isUpdatedAnswer = itemIds?.includes(activityItem.activityItem.id!);

    switch (activityItem.activityItem.responseType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.Slider: {
        if (!isUpdatedAnswer) {
          const updatedItemIds = updateItemIds(
            defaultAnswerValue !== watchAnswer,
            itemIds,
            activityItem.activityItem.id!,
          );
          setItemIds(updatedItemIds);

          return getValues(edited);
        }

        return defaultAnswerValue !== watchAnswer ? new Date().getTime() : getValues(edited);
      }

      case ItemResponseType.MultipleSelection: {
        const areArraysEqual = isEqual(
          formatToNumberArray(defaultAnswerValue as string[]).sort(),
          formatToNumberArray(watchAnswer as string[]).sort(),
        );

        if (!isUpdatedAnswer) {
          const updatedItemIds = updateItemIds(
            !areArraysEqual,
            itemIds,
            activityItem.activityItem.id!,
          );
          setItemIds(updatedItemIds);

          return getValues(edited);
        }

        return !areArraysEqual ? new Date().getTime() : getValues(edited);
      }
      default:
        return getValues(edited);
    }
  };

  useEffect(() => {
    setValue(edited, checkEditedValue());
  }, [watchAnswer]);

  switch (activityItem.activityItem.responseType) {
    case 'singleSelect':
      return (
        <SingleSelectionController
          control={control}
          name={controlName}
          activityItem={activityItem as SingleSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'multiSelect':
      return (
        <MultipleSelectionController
          control={control}
          name={controlName}
          activityItem={activityItem as MultiSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'slider':
      return (
        <SliderController
          control={control}
          name={controlName}
          activityItem={activityItem as SliderItemAnswer}
          isDisabled={isDisabled}
        />
      );
    default:
      return <></>;
  }
};
