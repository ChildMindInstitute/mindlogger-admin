import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { endOfMonth, format, isValid, startOfMonth } from 'date-fns';

import { ReviewActivity, getReviewActivitiesApi, getAppletSubmitDateListApi } from 'api';
import { DatePicker, DatePickerUiType } from 'shared/components';
import { useAsync, useRespondentLabel } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  selectedActivity,
  selectedAnswer,
  setSelectedActivity,
  onSelectAnswer,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const [searchParams] = useSearchParams();
  const respondentLabel = useRespondentLabel();

  const selectedDateParam = searchParams.get('selectedDate');

  const selectedDate =
    selectedDateParam && isValid(new Date(selectedDateParam!))
      ? new Date(selectedDateParam!)
      : null;
  const defaultDate = selectedDate || new Date();
  const dataTestid = 'respondents-review';

  const { control } = useForm({
    defaultValues: { date: defaultDate },
  });

  const date = useWatch({
    control,
    name: 'date',
  });

  const [submitDates, setSubmitDates] = useState<Date[] | undefined>(undefined);
  const [activities, setActivities] = useState<ReviewActivity[]>([]);

  const { execute: getAppletSubmitDateList, isLoading } = useAsync(
    getAppletSubmitDateListApi,
    (datesApiResult) => {
      const datesResult = datesApiResult?.data?.result;
      if (!datesResult) return;

      const submitDates = datesResult.dates.map((date: string) => new Date(date));
      setSubmitDates(submitDates);
    },
  );

  const { execute: getReviewActivities } = useAsync(getReviewActivitiesApi, (res) => {
    res?.data?.result && setActivities(res.data.result);
    const activity = res?.data?.result?.find(
      ({ id, answerDates }) => id === selectedActivity?.id && answerDates.length,
    );
    if (!activity) {
      setSelectedActivity(null);
    }
    onSelectAnswer(null);
  });

  const setSubmitDatesFromApi = (fromDate: string, toDate: string) => {
    if (!appletId || !respondentId) return;

    getAppletSubmitDateList({
      appletId,
      respondentId,
      fromDate,
      toDate,
    });
  };

  const onMonthChange = (date: Date) => {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    setSubmitDatesFromApi(String(startDate.getTime()), String(endDate.getTime()));
  };

  useEffect(() => {
    onMonthChange(selectedDate || new Date());
  }, []);

  useEffect(() => {
    if (appletId && respondentId && date) {
      getReviewActivities({
        appletId,
        respondentId,
        createdDate: format(date || new Date(), DateFormats.YearMonthDay),
      });
    }
  }, [date]);

  return (
    <StyledMenu>
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
          disabled={false}
          isLoading={isLoading}
          data-testid={`${dataTestid}-review-date`}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity, index) => (
        <ReviewMenuItem
          key={activity.id}
          selectedDate={date}
          isSelected={selectedActivity?.id === activity.id}
          activity={activity}
          setSelectedActivity={setSelectedActivity}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          data-testid={`${dataTestid}-activity-${index}`}
        />
      ))}
    </StyledMenu>
  );
};
