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
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.types';

import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({
  activityItem,
  isDisabled,
  'data-testid': dataTestid,
}: ItemPickerProps) => {
  const { control, getValues } = useFormContext<FeedbackForm>();
  const { assessmentItems } = getValues();

  const activityItemIndex = getActivityItemIndex(
    assessmentItems,
    activityItem.activityItem.id || '',
  );

  const controlName = `assessmentItems.${activityItemIndex}.answers` as const;

  switch (activityItem.activityItem.responseType) {
    case 'singleSelect':
      return (
        <SingleSelectionController
          control={control}
          name={controlName}
          activityItem={activityItem as SingleSelectItemAnswer}
          isDisabled={isDisabled}
          data-testid={dataTestid}
        />
      );
    case 'multiSelect':
      return (
        <MultipleSelectionController
          control={control}
          name={controlName}
          activityItem={activityItem as MultiSelectItemAnswer}
          isDisabled={isDisabled}
          data-testid={dataTestid}
        />
      );
    case 'slider':
      return (
        <SliderController
          control={control}
          name={controlName}
          activityItem={activityItem as SliderItemAnswer}
          isDisabled={isDisabled}
          data-testid={dataTestid}
        />
      );
    default:
      return <></>;
  }
};
