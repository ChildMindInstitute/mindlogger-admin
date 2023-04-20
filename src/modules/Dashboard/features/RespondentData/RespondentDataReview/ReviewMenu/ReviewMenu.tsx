import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { users } from 'redux/modules';
import { getAnswersApi, getAppletSubmitDateListApi } from 'api';
import { DatePicker, DatePickerUiType, Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { Activity } from '../RespondentDataReview.types';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';
import { getRespondentLabel } from '../../RespondentData.utils';

export const ReviewMenu = ({
  selectedActivity,
  selectedAnswer,
  setSelectedActivity,
  setSelectedAnswer,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const { secretId, nickname } = users.useRespondent(respondentId || '') || {};
  const respondentLabel = getRespondentLabel(secretId, nickname);
  const { control, watch, setValue } = useForm({ defaultValues: { date: undefined } });
  const date = watch('date');

  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [submitDates, setSubmitDates] = useState<Date[] | undefined>(undefined);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { execute: executeGetAppletSubmitDatesApi, isLoading: isLoadingDates } = useAsync(
    getAppletSubmitDateListApi,
    (res) => {
      if (res?.data?.result) {
        const dates = res.data.result.dates.map((date: string) => new Date(date));
        setSubmitDates(dates);
        setValue('date', dates[dates.length - 1]);
      }
    },
  );

  const { execute: executeGetAnswers, isLoading: isLoadingAnswers } = useAsync(
    getAnswersApi,
    (res) => res?.data?.result && setActivities(res.data.result),
  );

  useEffect(() => {
    if (appletId && respondentId) {
      executeGetAppletSubmitDatesApi({
        appletId,
        respondentId,
        fromDate: String(startDate.getTime()),
        toDate: String(endDate.getTime()),
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (appletId && respondentId && (date || submitDates)) {
      executeGetAnswers({
        id: appletId,
        respondentId,
        createdDate: format(date || new Date(), DateFormats.YearMonthDay),
      });
    }
  }, [date, submitDates]);

  const onMonthChange = (date: Date) => {
    setStartDate(startOfMonth(date));
    setEndDate(endOfMonth(date));
  };

  return (
    <StyledMenu>
      {isLoadingAnswers || (isLoadingDates && <Spinner />)}
      <StyledHeader>
        <StyledHeadlineLarge>{t('review')}</StyledHeadlineLarge>
        <StyledLabelLarge sx={{ marginBottom: theme.spacing(4) }}>
          {respondentLabel}
        </StyledLabelLarge>
        <DatePicker
          name="date"
          control={control}
          uiType={DatePickerUiType.OneDate}
          label={t('reviewDate')}
          minDate={null}
          includeDates={submitDates}
          onMonthChange={onMonthChange}
          disabled={!submitDates}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity) => (
        <ReviewMenuItem
          key={activity.id}
          isSelected={selectedActivity?.id === activity.id}
          activity={activity}
          setSelectedActivity={setSelectedActivity}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      ))}
    </StyledMenu>
  );
};
