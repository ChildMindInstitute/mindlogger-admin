import {
  ActivityItemAnswer,
  ItemAnswer,
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

export const getResponseItem = ({ activityItem, answer }: ActivityItemAnswer) => {
  const responseType = activityItem.responseType;
  switch (responseType) {
    case ItemResponseType.SingleSelection:
      return (
        <SingleSelection
          activityItem={activityItem as SingleSelectActivityItem}
          value={(answer as ItemAnswer).value as string}
          isDisabled
        />
      );
    case ItemResponseType.MultipleSelection:
      return (
        <MultipleSelection
          activityItem={activityItem as MultiSelectActivityItem}
          value={(answer as ItemAnswer).value as number[]}
          isDisabled
        />
      );
    case ItemResponseType.Slider:
      return (
        <Slider
          activityItem={activityItem as SliderActivityItem}
          value={(answer as ItemAnswer).value as number}
          isDisabled
        />
      );
    default:
      <></>;
  }
};
