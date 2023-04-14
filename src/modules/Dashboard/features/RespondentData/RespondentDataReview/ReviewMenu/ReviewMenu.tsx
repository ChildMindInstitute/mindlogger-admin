import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { getAnswersApi } from 'api';
import { DatePicker, DatePickerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { Activity } from '../RespondentDataReview.types';
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
  const { control, watch } = useForm({ defaultValues: { date: new Date() } });
  const date = watch('date');
  const [activities, setActivities] = useState<Activity[]>([]);

  const { execute } = useAsync(
    getAnswersApi,
    (res) => res?.data?.result && setActivities(res?.data?.result),
  );

  useEffect(() => {
    if (appletId && respondentId) {
      execute({ id: appletId, respondentId, createdDate: format(date, DateFormats.YearMonthDay) });
    }
  }, [appletId, respondentId, date]);

  return (
    <StyledMenu>
      <StyledHeader>
        <StyledHeadlineLarge>{t('review')}</StyledHeadlineLarge>
        <StyledLabelLarge sx={{ marginBottom: theme.spacing(4) }}>
          User: 112233 (John Snow)
        </StyledLabelLarge>
        <DatePicker
          name="date"
          value={new Date()}
          control={control}
          uiType={DatePickerUiType.OneDate}
          label={t('reviewDate')}
          maxDate={new Date()}
          minDate={null}
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
