import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DatePicker, TimePicker } from 'shared/components';
import { StyledBodyLarge, theme } from 'shared/styles';

import { StyledForm, StyledTimeText } from './ReportFilters.styles';

export const ReportFilters = () => {
  const { t } = useTranslation();

  const { control } = useForm();

  return (
    <StyledForm>
      <DatePicker
        name="startDate"
        control={control}
        label={t('startDate')}
        inputSx={{ width: '19rem' }}
      />
      <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
      <DatePicker
        name="endDate"
        control={control}
        label={t('endDate')}
        inputSx={{ width: '19rem' }}
      />
      <Box sx={{ position: 'relative' }}>
        <TimePicker
          name="startTime"
          control={control}
          label={t('startTime')}
          wrapperSx={{ width: '13rem', marginLeft: theme.spacing(2.4) }}
        />
        <StyledTimeText>{t('timeIsShownInUTC')}</StyledTimeText>
      </Box>
      <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
      <TimePicker
        name="endTime"
        control={control}
        label={t('endTime')}
        wrapperSx={{ width: '13rem', marginRight: theme.spacing(1.2) }}
      />
      <Button>{t('moreFilters')}</Button>
    </StyledForm>
  );
};
