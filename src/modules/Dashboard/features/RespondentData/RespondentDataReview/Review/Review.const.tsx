import { ItemResponseType } from 'shared/consts';
import { ActivityItemAnswer } from 'shared/types';

import {
  MultiSelectItemAnswer,
  SingleSelectItemAnswer,
  SliderItemAnswer,
  TextItemAnswer,
} from '../RespondentDataReview.types';
import { SingleSelectResponseItem } from '../SingleSelectResponseItem';
import { SliderResponseItem } from '../SliderResponseItem';
import { TextResponseItem } from '../TextResponseItem';
import { MultiSelectResponseItem } from '../MultiSelectResponseItem';

export const getResponseItem = (activityItemAnswer: ActivityItemAnswer) => {
  switch (activityItemAnswer.activityItem.responseType) {
    case ItemResponseType.SingleSelection:
      return <SingleSelectResponseItem {...(activityItemAnswer as SingleSelectItemAnswer)} />;
    case ItemResponseType.MultipleSelection:
      return <MultiSelectResponseItem {...(activityItemAnswer as MultiSelectItemAnswer)} />;
    case ItemResponseType.Slider:
      return <SliderResponseItem {...(activityItemAnswer as SliderItemAnswer)} />;
    case ItemResponseType.Text:
      return <TextResponseItem {...(activityItemAnswer as TextItemAnswer)} />;
  }
};
