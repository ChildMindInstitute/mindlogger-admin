import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { DatePicker, TimePicker } from 'shared/components';
import { StyledBodyLarge, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { Switch, TagsInputController } from 'shared/components/FormComponents';
import { getUniqueIdentifierOptions } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.utils';

import { StyledFiltersContainer, StyledMoreFilters, StyledTimeText } from './ReportFilters.styles';
import { ReportFiltersProps } from './ReportFilters.types';
import { MIN_DATE } from './ReportFilters.const';

export const ReportFilters = ({ identifiers = [], versions = [] }: ReportFiltersProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();

  const moreFiltersVisible = watch('moreFiltersVisible');
  const filterByIdentifier = watch('filterByIdentifier');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const versionsOptions = versions.map(({ version }) => ({ label: version, id: version }));

  const identifiersOptions = getUniqueIdentifierOptions(identifiers);

  const moreFiltersHandler = () => {
    setValue('moreFiltersVisible', !moreFiltersVisible);
  };

  const onCloseCallback = () => {
    if (endDate < startDate) {
      setValue('endDate', addDays(startDate, 1));
    }
  };

  return (
    <form>
      <StyledFiltersContainer>
        <StyledFlexTopCenter>
          <DatePicker
            minDate={MIN_DATE}
            name="startDate"
            control={control}
            inputSx={{ width: '19rem' }}
            onCloseCallback={onCloseCallback}
            label={t('startDate')}
          />
          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <DatePicker
            minDate={startDate}
            name="endDate"
            control={control}
            inputSx={{ width: '19rem' }}
            label={t('endDate')}
          />
        </StyledFlexTopCenter>

        <StyledFlexTopCenter sx={{ position: 'relative' }}>
          <TimePicker
            name="startTime"
            control={control}
            label={t('startTime')}
            wrapperSx={{ width: '13rem' }}
          />
          <StyledTimeText>{t('timeIsShownInUTC')}</StyledTimeText>

          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <TimePicker
            name="endTime"
            control={control}
            label={t('endTime')}
            wrapperSx={{ width: '13rem' }}
          />
          <StyledMoreFilters
            onClick={moreFiltersHandler}
            sx={{
              backgroundColor: moreFiltersVisible ? variables.palette.primary_alfa12 : '',
            }}
          >
            {t('moreFilters')}
          </StyledMoreFilters>
        </StyledFlexTopCenter>
      </StyledFiltersContainer>
      {moreFiltersVisible && (
        <Box sx={{ mb: theme.spacing(4.8) }}>
          {!!identifiersOptions?.length && (
            <Switch name="filterByIdentifier" control={control} label={t('filterByIdentifier')} />
          )}
          <StyledFlexTopCenter sx={{ mt: theme.spacing(0.8) }}>
            <Box sx={{ width: '36rem' }}>
              <TagsInputController
                name="identifier"
                limitTags={2}
                label={t('respondentIdentifier')}
                options={identifiersOptions}
                control={control}
                noOptionsText={t('noRespondentIdentifier')}
                labelAllSelect={t('selectAll')}
                disabled={!filterByIdentifier}
              />
            </Box>
            <Box sx={{ width: '36rem', ml: theme.spacing(2.4) }}>
              <TagsInputController
                name="versions"
                limitTags={2}
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
