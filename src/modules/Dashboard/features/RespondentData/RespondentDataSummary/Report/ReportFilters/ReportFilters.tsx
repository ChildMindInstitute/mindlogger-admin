import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DatePicker, TimePicker, DatePickerUiType } from 'shared/components';
import { StyledBodyLarge, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { Switch, TagsInputController } from 'shared/components/FormComponents';

import { StyledTimeText } from './ReportFilters.styles';
import { FilterValues } from './ReportFilters.types';

export const ReportFilters = () => {
  const { t } = useTranslation('app');
  const { control, setValue, watch, register, unregister } = useForm<FilterValues>({
    defaultValues: {
      startDateEndDate: [],
      moreFiltersVisisble: false,
      startTime: '',
      endTime: '',
    },
  });

  const moreFiltersVisisble = watch('moreFiltersVisisble');
  const filterByIdentifier = watch('filterByIdentifier');

  const moreFiltersHandler = () => {
    setValue('moreFiltersVisisble', !moreFiltersVisisble);
    if (moreFiltersVisisble) {
      unregister('identifier');
      unregister('versions');
      unregister('filterByIdentifier');
    } else {
      register('identifier', { value: [] });
      register('versions', { value: [] });
      register('filterByIdentifier', { value: true });
    }
  };

  return (
    <form>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(3.2) }}>
        <DatePicker
          name="startDateEndDate"
          uiType={DatePickerUiType.StartEndingDate}
          control={control}
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
        <Button
          onClick={moreFiltersHandler}
          sx={{
            height: '5.5rem',
            backgroundColor: moreFiltersVisisble ? variables.palette.primary_alfa12 : '',
          }}
        >
          {t('moreFilters')}
        </Button>
      </StyledFlexTopCenter>
      {moreFiltersVisisble && (
        <>
          <Switch name="filterByIdentifier" control={control} label={t('filterByIdentifier')} />
          <StyledFlexTopCenter sx={{ mt: theme.spacing(0.8) }}>
            <Box sx={{ width: '28rem' }}>
              <TagsInputController
                name="identifier"
                label={t('respondentIdentifier')}
                options={[]}
                control={control}
                noOptionsText={t('noRespondentIdentifier')}
                labelAllSelect={t('selectAll')}
                disabled={!filterByIdentifier}
              />
            </Box>
            <Box sx={{ width: '28rem', ml: theme.spacing(2.4) }}>
              <TagsInputController
                name="versions"
                label={t('versions')}
                options={[]}
                control={control}
                noOptionsText={t('noVersions')}
                labelAllSelect={t('selectAll')}
              />
            </Box>
          </StyledFlexTopCenter>
        </>
      )}
    </form>
  );
};
