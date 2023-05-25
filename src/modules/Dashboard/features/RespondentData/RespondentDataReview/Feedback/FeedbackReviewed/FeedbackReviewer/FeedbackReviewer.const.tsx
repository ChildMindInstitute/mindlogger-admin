import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackReviewed/FeedbackReviewed.types';
import {
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

export const getResponseItem = (activityItemAnswer: ActivityItemAnswer) => {
  const responseType = activityItemAnswer.activityItem.responseType;
  switch (responseType) {
    case ItemResponseType.SingleSelection:
      return (
        <SingleSelection
          activityItem={activityItemAnswer.activityItem as SingleSelectActivityItem}
          value={(activityItemAnswer.answer as ItemAnswer).value as string}
          isDisabled
        />
      );
    case ItemResponseType.MultipleSelection:
      return (
        <MultipleSelection
          activityItem={activityItemAnswer.activityItem as MultiSelectActivityItem}
          value={(activityItemAnswer.answer as ItemAnswer).value as string[]}
          isDisabled
        />
      );
    case ItemResponseType.Slider:
      return (
        <Slider
          activityItem={activityItemAnswer.activityItem as SliderActivityItem}
          value={(activityItemAnswer.answer as ItemAnswer).value as number}
          isDisabled
        />
      );
    default:
      <></>;
  }
};
