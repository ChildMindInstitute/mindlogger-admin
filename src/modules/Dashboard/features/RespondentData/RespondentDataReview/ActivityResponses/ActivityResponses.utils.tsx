import { format } from 'date-fns';
import { Box } from '@mui/material';

import { DateFormats, ItemResponseType } from 'shared/consts';
import { ActivityItemAnswer, DecryptedTimeAnswer } from 'shared/types';
import { StyledBodyLarge, variables } from 'shared/styles';
import i18n from 'i18n';
import { isObject } from 'shared/utils/isObject';

import {
  MultiSelectItemAnswer,
  SingleSelectItemAnswer,
  SliderItemAnswer,
  TextItemAnswer,
  ParagraphTextItemAnswer,
  NumberSelectionItemAnswer,
  DateItemAnswer,
  TimeRangeItemAnswer,
  SingleMultiSelectPerRowItemAnswer,
  SliderRowsItemAnswer,
} from '../RespondentDataReview.types';
import { SingleSelectResponseItem } from '../ResponseItems/SingleSelectResponseItem';
import { SliderResponseItem } from '../ResponseItems/SliderResponseItem';
import { TextResponseItem } from '../ResponseItems/TextResponseItem';
import { MultiSelectResponseItem } from '../ResponseItems/MultiSelectResponseItem';
import { NumberSelectionResponseItem } from '../ResponseItems/NumberSelectionResponseItem';
import { DateResponseItem } from '../ResponseItems/DateResponseItem';
import { TimeRangeResponseItem } from '../ResponseItems/TimeRangeResponseItem';
import { SingleMultiSelectPerRowResponseItem } from '../ResponseItems/SingleMultiSelectPerRowResponseItem';
import { SliderRowsResponseItem } from '../ResponseItems/SliderRowsResponseItem';

const { t } = i18n;

export const getTimeResponseItem = (answer?: DecryptedTimeAnswer) => {
  if (!answer) return;

  const date = new Date();

  const hours = answer?.value?.hours ?? answer?.hour ?? 0;
  const minutes = answer?.value?.minutes ?? answer?.minute ?? 0;

  date.setHours(hours);
  date.setMinutes(minutes);

  return format(date, DateFormats.Time);
};

export const getResponseItem = (activityItemAnswer: ActivityItemAnswer) => {
  const responseType = activityItemAnswer.activityItem.responseType;
  if (
    !activityItemAnswer.answer ||
    // exception for MiResource answers for Text Item: in case of receiving an object instead of
    // string or null
    ((responseType === ItemResponseType.Text || responseType === ItemResponseType.ParagraphText) &&
      isObject(activityItemAnswer.answer))
  ) {
    return (
      <StyledBodyLarge color={variables.palette.outline} data-testid="no-response-data">
        {t('noResponseData')}
      </StyledBodyLarge>
    );
  }

  switch (responseType) {
    case ItemResponseType.SingleSelection:
      return <SingleSelectResponseItem {...(activityItemAnswer as SingleSelectItemAnswer)} />;
    case ItemResponseType.MultipleSelection:
      return <MultiSelectResponseItem {...(activityItemAnswer as MultiSelectItemAnswer)} />;
    case ItemResponseType.Slider:
      return <SliderResponseItem {...(activityItemAnswer as SliderItemAnswer)} />;
    case ItemResponseType.Text:
    case ItemResponseType.ParagraphText:
      return (
        <TextResponseItem {...(activityItemAnswer as TextItemAnswer | ParagraphTextItemAnswer)} />
      );
    case ItemResponseType.NumberSelection:
      return <NumberSelectionResponseItem {...(activityItemAnswer as NumberSelectionItemAnswer)} />;
    case ItemResponseType.Time: {
      const answer = activityItemAnswer.answer as DecryptedTimeAnswer;

      return (
        <Box data-testid={activityItemAnswer['data-testid']}>{getTimeResponseItem(answer)}</Box>
      );
    }
    case ItemResponseType.TimeRange:
      return <TimeRangeResponseItem {...(activityItemAnswer as TimeRangeItemAnswer)} />;
    case ItemResponseType.Date:
      return <DateResponseItem {...(activityItemAnswer as DateItemAnswer)} />;
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return (
        <SingleMultiSelectPerRowResponseItem
          {...(activityItemAnswer as SingleMultiSelectPerRowItemAnswer)}
        />
      );
    case ItemResponseType.SliderRows:
      return <SliderRowsResponseItem {...(activityItemAnswer as SliderRowsItemAnswer)} />;
  }
};
