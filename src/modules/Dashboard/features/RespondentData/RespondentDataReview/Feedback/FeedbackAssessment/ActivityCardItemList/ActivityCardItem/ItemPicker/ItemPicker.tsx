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
import { getActivityItemIndex } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessmentControllers/utils';

import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({ activityItem, isDisabled }: ItemPickerProps) => {
  const { control, getValues } = useFormContext();

  const activityItemIndex = getActivityItemIndex(
    getValues('answers'),
    activityItem.activityItem.id || '',
  );

  switch (activityItem.activityItem.responseType) {
    case 'singleSelect':
      return (
        <SingleSelectionController
          control={control}
          name={`answers.${activityItemIndex}.answer.value`}
          activityItem={activityItem as SingleSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'multiSelect':
      return (
        <MultipleSelectionController
          control={control}
          name={`answers.${activityItemIndex}.answer.value`}
          activityItem={activityItem as MultiSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'slider':
      return (
        <SliderController
          control={control}
          name={`answers.${activityItemIndex}.answer.value`}
          activityItem={activityItem as SliderItemAnswer}
          isDisabled={isDisabled}
        />
      );
    default:
      return <></>;
  }
};
