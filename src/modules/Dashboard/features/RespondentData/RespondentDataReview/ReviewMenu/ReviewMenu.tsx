import { useTranslation } from 'react-i18next';

import { DatePicker, DatePickerUiType } from 'shared/components';
import { useRespondentLabel } from 'shared/hooks';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  control,
  selectedDate,
  responseDates,
  onMonthChange,
  activities,
  selectedActivity,
  selectedAnswer,
  setSelectedActivity,
  onDateChange,
  onSelectAnswer,
  isDatePickerLoading,
  lastActivityCompleted,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const respondentLabel = useRespondentLabel();

  const dataTestid = 'respondents-review-menu';

  return (
    <StyledMenu data-testid={dataTestid}>
      <StyledHeader>
        <StyledHeadlineLarge>{t('responses')}</StyledHeadlineLarge>
        <StyledLabelLarge sx={{ marginBottom: theme.spacing(4) }}>
          {respondentLabel}
        </StyledLabelLarge>
        <DatePicker
          name="responseDate"
          control={control}
          uiType={DatePickerUiType.OneDate}
          label={t('responseDate')}
          minDate={null}
          includeDates={responseDates}
          onMonthChange={onMonthChange}
          disabled={!lastActivityCompleted}
          onSubmitCallback={onDateChange}
          onCloseCallback={onDateChange}
          isLoading={isDatePickerLoading}
          data-testid={`${dataTestid}-review-date`}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity, index) => (
        <ReviewMenuItem
          key={activity.id}
          selectedDate={selectedDate}
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
