import { Box } from '@mui/material';

import { ItemResponseType } from 'shared/consts';
import { ActivityItemAnswer, DecryptedTimeAnswer } from 'shared/types';

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
import { getTimeResponseItem } from './Review.utils';

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
    case ItemResponseType.Time: {
      const answer = activityItemAnswer.answer as DecryptedTimeAnswer;

      return (
        <Box data-testid={activityItemAnswer['data-testid']}>
          {getTimeResponseItem(answer?.value ?? answer)}
        </Box>
      );
    }
  }
};
