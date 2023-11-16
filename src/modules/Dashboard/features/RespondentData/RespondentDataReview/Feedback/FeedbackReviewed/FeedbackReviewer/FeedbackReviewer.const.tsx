import {
  AssessmentActivityItem,
  MultiSelectActivityItem,
  SingleSelectActivityItem,
  SliderActivityItem,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { ItemResponseType } from 'shared/consts';
import {
  MultipleSelection,
  SingleSelection,
  Slider,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'shared/types';

export const getResponseItem = ({ activityItem, answer }: AssessmentActivityItem) => {
  const responseType = activityItem.responseType;
  switch (responseType) {
    case ItemResponseType.SingleSelection:
      return (
        <SingleSelection
          activityItem={activityItem as SingleSelectActivityItem}
          value={(answer as DecryptedSingleSelectionAnswer).value}
          isDisabled
        />
      );
    case ItemResponseType.MultipleSelection:
      return (
        <MultipleSelection
          activityItem={activityItem as MultiSelectActivityItem}
          value={(answer as DecryptedMultiSelectionAnswer).value}
          isDisabled
        />
      );
    case ItemResponseType.Slider:
      return (
        <Slider
          activityItem={activityItem as SliderActivityItem}
          value={(answer as DecryptedSliderAnswer).value}
          isDisabled
        />
      );
    default:
      <></>;
  }
};
