import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { DatePicker, DatePickerUiType, Spinner, SpinnerUiType } from 'shared/components';
import { useRespondentLabel } from 'shared/hooks';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  control,
  responseDates,
  onMonthChange,
  activities,
  flows,
  selectedActivityId,
  selectedFlowId,
  selectedAnswer,
  onDateChange,
  onSelectAnswer,
  isDatePickerLoading,
  lastActivityCompleted,
  isActivitiesFlowsLoading,
  onSelectActivity,
  onSelectFlow,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const respondentLabel = useRespondentLabel(true);

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
      <Box sx={{ position: 'relative', minHeight: '10rem' }}>
        {isActivitiesFlowsLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        {!!flows?.length && (
          <>
            <StyledHeadlineLarge sx={{ margin: theme.spacing(1.6) }}>
              {t('activityFlows')}
            </StyledHeadlineLarge>
            {flows.map((flow, index) => (
              <ReviewMenuItem
                key={flow.id}
                isSelected={selectedFlowId === flow.id}
                item={flow}
                onSelectItem={onSelectFlow}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={onSelectAnswer}
                data-testid={`${dataTestid}-flow-${index}`}
              />
            ))}
          </>
        )}
        {!!activities?.length && (
          <>
            <StyledHeadlineLarge sx={{ margin: theme.spacing(1.6) }}>
              {t('activities')}
            </StyledHeadlineLarge>
            {activities.map((activity, index) => (
              <ReviewMenuItem
                key={activity.id}
                isSelected={selectedActivityId === activity.id}
                item={activity}
                onSelectItem={onSelectActivity}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={onSelectAnswer}
                data-testid={`${dataTestid}-activity-${index}`}
              />
            ))}
          </>
        )}
      </Box>
    </StyledMenu>
  );
};
