import { MultiSelectItem, SingleSelectItem, SliderItem } from 'shared/state';
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

import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({ activityItem, isDisabled }: ItemPickerProps) => {
  switch (activityItem.activityItem.responseType) {
    case 'singleSelect':
      return (
        <SingleSelectionController
          activityItem={activityItem as SingleSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'multiSelect':
      return (
        <MultipleSelectionController
          activityItem={activityItem as MultiSelectItemAnswer}
          isDisabled={isDisabled}
        />
      );
    case 'slider':
      return (
        <SliderController activityItem={activityItem as SliderItemAnswer} isDisabled={isDisabled} />
      );
    default:
      return <></>;
  }
};
