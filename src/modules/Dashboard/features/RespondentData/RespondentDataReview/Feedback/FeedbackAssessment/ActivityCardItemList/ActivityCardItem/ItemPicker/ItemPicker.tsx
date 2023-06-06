import { useFormContext } from 'react-hook-form';
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
import { AssessmentForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessmentForm/FeedbackAssessmentForm.types';

import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({ activityItem, isDisabled }: ItemPickerProps) => {
  const { control, getValues } = useFormContext<AssessmentForm>();
  const { assessmentItems } = getValues();

  const activityItemIndex = getActivityItemIndex(
    assessmentItems,
    activityItem.activityItem.id || '',
  );

  switch (activityItem.activityItem.responseType) {
    case 'singleSelect':
      return (
        <SingleSelectionController
          control={control}
          name={`assessmentItems.${activityItemIndex}.answers`}
          activityItem={activityItem as SingleSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'multiSelect':
      return (
        <MultipleSelectionController
          control={control}
          name={`assessmentItems.${activityItemIndex}.answers`}
          activityItem={activityItem as MultiSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'slider':
      return (
        <SliderController
          control={control}
          name={`assessmentItems.${activityItemIndex}.answers`}
          activityItem={activityItem as SliderItemAnswer}
          isDisabled={isDisabled}
        />
      );
    default:
      return <></>;
  }
};
