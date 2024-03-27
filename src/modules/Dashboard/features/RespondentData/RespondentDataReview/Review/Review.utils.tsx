import { format } from 'date-fns';
import { Box } from '@mui/material';

import { DateFormats, ItemResponseType } from 'shared/consts';
import { ActivityItemAnswer, DecryptedTimeAnswer } from 'shared/types';
import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme, variables } from 'shared/styles';
import i18n from 'i18n';

import {
  Answer,
  MultiSelectItemAnswer,
  SingleSelectItemAnswer,
  SliderItemAnswer,
  TextItemAnswer,
  NumberSelectionItemAnswer,
  DateItemAnswer,
  TimeRangeItemAnswer,
  SingleMultiSelectPerRowItemAnswer,
} from '../RespondentDataReview.types';
import { SingleSelectResponseItem } from '../SingleSelectResponseItem';
import { SliderResponseItem } from '../SliderResponseItem';
import { TextResponseItem } from '../TextResponseItem';
import { MultiSelectResponseItem } from '../MultiSelectResponseItem';
import { NumberSelectionResponseItem } from '../NumberSelectionResponseItem';
import { DateResponseItem } from '../DateResponseItem';
import { TimeRangeResponseItem } from '../TimeRangeResponseItem';
import { SingleMultiSelectPerRowResponseItem } from '../SingleMultiSelectPerRowResponseItem';

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

export const renderEmptyState = (selectedAnswer: Answer | null) => {
  if (!selectedAnswer) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('emptyReview')}
        </StyledTitleLarge>
      </>
    );
  }

  return (
    <>
      <Svg id="chart" width="67" height="67" />
      <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
        {t('noDataForActivity')}
      </StyledTitleLarge>
    </>
  );
};

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
  }
};
