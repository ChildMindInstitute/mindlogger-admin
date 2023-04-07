import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DatePicker, DatePickerUiType } from 'shared/components';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { getMockedResponses } from './mock';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  activities,
  selectedActivity,
  selectedResponse,
  setSelectedActivity,
  setSelectedResponse,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const { control } = useForm();

  return (
    <StyledMenu>
      <StyledHeader>
        <StyledHeadlineLarge>{t('review')}</StyledHeadlineLarge>
        <StyledLabelLarge sx={{ marginBottom: theme.spacing(4) }}>
          User: 112233 (John Snow)
        </StyledLabelLarge>
        <DatePicker
          name="date"
          value={new Date(2023, 0, 31)}
          control={control}
          uiType={DatePickerUiType.OneDate}
          label={t('reviewDate')}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity, index) => (
        <ReviewMenuItem
          key={activity.id}
          isSelected={selectedActivity.id === activity.id}
          item={activity}
          responses={getMockedResponses(activity.id || '', index)}
          selectedResponse={selectedResponse}
          setSelectedItem={setSelectedActivity}
          setSelectedResponse={setSelectedResponse}
        />
      ))}
    </StyledMenu>
  );
};
