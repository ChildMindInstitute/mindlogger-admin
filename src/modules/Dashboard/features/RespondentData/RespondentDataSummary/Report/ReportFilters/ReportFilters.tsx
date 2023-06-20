import { Box, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { DatePicker, TimePicker, DatePickerUiType } from 'shared/components';
import { StyledBodyLarge, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { Switch, TagsInputController } from 'shared/components/FormComponents';

import { StyledTimeText } from './ReportFilters.styles';
import { ReportFiltersProps } from './ReportFilters.types';

export const ReportFilters = ({ identifiers = [], versions = [] }: ReportFiltersProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue, register, unregister } = useFormContext();

  const moreFiltersVisisble = watch('moreFiltersVisisble');
  const filterByIdentifier = watch('filterByIdentifier');
  const startDateEndDate = watch('startDateEndDate');

  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 3));

  const versionsOptions = versions.map(({ version }) => ({ label: version, id: version }));

  const uniqueIdentifiers = [...new Set(identifiers.map(({ decryptedValue }) => decryptedValue))];
  const identifiersOptions = uniqueIdentifiers.map((identifier) => ({
    label: identifier,
    id: identifier,
  }));

  const moreFiltersHandler = () => {
    setValue('moreFiltersVisisble', !moreFiltersVisisble);
    if (moreFiltersVisisble) {
      unregister('identifier');
      unregister('filterByIdentifier');
    } else {
      register('identifier', { value: [] });
      register('filterByIdentifier', { value: true });
    }
  };

  const onCloseCallback = () => {
    if (!startDateEndDate[1]) {
      const startDate = startDateEndDate[0];
      setValue('startDateEndDate', [startDate, addDays(startDate, 1)]);
    }
  };

  return (
    <form>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(3.2) }}>
        <DatePicker
          minDate={minDate}
          name="startDateEndDate"
          uiType={DatePickerUiType.StartEndingDate}
          control={control}
          inputSx={{ width: '19rem' }}
          onCloseCallback={onCloseCallback}
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
        <Box sx={{ mb: theme.spacing(4.8) }}>
          <Switch name="filterByIdentifier" control={control} label={t('filterByIdentifier')} />
          <StyledFlexTopCenter sx={{ mt: theme.spacing(0.8) }}>
            <Box sx={{ width: '28rem' }}>
              <TagsInputController
                name="identifier"
                label={t('respondentIdentifier')}
                options={identifiersOptions}
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
                options={versionsOptions}
                control={control}
                noOptionsText={t('noVersions')}
                labelAllSelect={t('selectAll')}
              />
            </Box>
          </StyledFlexTopCenter>
        </Box>
      )}
    </form>
  );
};
