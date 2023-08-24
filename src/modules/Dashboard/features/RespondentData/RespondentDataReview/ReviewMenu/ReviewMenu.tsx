import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { endOfMonth, format, isValid, startOfMonth } from 'date-fns';

import { ReviewActivity, getReviewActivitiesApi, getAppletSubmitDateListApi } from 'api';
import { DatePicker, DatePickerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';
import { useRespondentLabel } from 'modules/Dashboard/hooks';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  selectedActivity,
  selectedAnswer,
  setSelectedActivity,
  setSelectedAnswer,
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

  const { control } = useForm({
    defaultValues: { date: defaultDate },
  });

  const date = useWatch({
    control,
    name: 'date',
  });

  const [startDate, setStartDate] = useState(selectedDate || startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [submitDates, setSubmitDates] = useState<Date[] | undefined>(undefined);
  const [activities, setActivities] = useState<ReviewActivity[]>([]);

  const { execute: getAppletSubmitDateList } = useAsync(getAppletSubmitDateListApi);

  const { execute: getReviewActivities } = useAsync(getReviewActivitiesApi, (res) => {
    res?.data?.result && setActivities(res.data.result);
    const activity = res?.data?.result?.find(
      ({ id, answerDates }) => id === selectedActivity?.id && answerDates.length,
    );
    if (!activity) {
      setSelectedActivity(null);
    }
    setSelectedAnswer(null);
  });

  useEffect(() => {
    (async () => {
      if (appletId && respondentId) {
        const datesResult = await getAppletSubmitDateList({
          appletId,
          respondentId,
          fromDate: String(startDate.getTime()),
          toDate: String(endDate.getTime()),
        });

        if (datesResult?.data?.result) {
          const dates = datesResult.data.result.dates.map((date: string) => new Date(date));
          setSubmitDates(dates);
        }
      }
    })();
  }, [startDate, endDate]);

  useEffect(() => {
    if (appletId && respondentId && date) {
      getReviewActivities({
        appletId,
        respondentId,
        createdDate: format(date || new Date(), DateFormats.YearMonthDay),
      });
    }
  }, [date]);

  const onMonthChange = (date: Date) => {
    setStartDate(startOfMonth(date));
    setEndDate(endOfMonth(date));
  };

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
          disabled={!submitDates}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity) => (
        <ReviewMenuItem
          key={activity.id}
          selectedDate={date}
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
