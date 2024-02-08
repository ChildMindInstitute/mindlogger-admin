import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
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
  const dataTestid = 'respondents-summary-filters';

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
            disabled={false}
            data-testid={`${dataTestid}-start-date`}
          />
          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <DatePicker
            minDate={startDate}
            name="endDate"
            control={control}
            inputSx={{ width: '19rem' }}
            label={t('endDate')}
            disabled={false}
            data-testid={`${dataTestid}-end-date`}
          />
        </StyledFlexTopCenter>

        <StyledFlexTopCenter sx={{ position: 'relative' }}>
          <TimePicker
            name="startTime"
            control={control}
            label={t('startTime')}
            wrapperSx={{ width: '13rem' }}
            data-testid={`${dataTestid}-start-time`}
          />
          <StyledTimeText>
            <Trans i18nKey="timeIsShownInUTC">
              Time is
              <br />
              shown in UTC
            </Trans>
          </StyledTimeText>

          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <TimePicker
            name="endTime"
            control={control}
            label={t('endTime')}
            wrapperSx={{ width: '13rem' }}
            data-testid={`${dataTestid}-end-time`}
          />
          <StyledMoreFilters
            onClick={moreFiltersHandler}
            sx={{
              backgroundColor: moreFiltersVisible ? variables.palette.primary_alfa12 : '',
            }}
            data-testid={`${dataTestid}-more-button`}>
            {t('moreFilters')}
          </StyledMoreFilters>
        </StyledFlexTopCenter>
      </StyledFiltersContainer>
      {moreFiltersVisible && (
        <Box sx={{ mb: theme.spacing(4.8) }} data-testid={`${dataTestid}-more`}>
          {!!identifiersOptions?.length && (
            <Switch
              name="filterByIdentifier"
              control={control}
              label={t('filterByIdentifier')}
              data-testid={`${dataTestid}-filter-by-identifier`}
            />
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
                defaultSelectedAll
                data-testid={`${dataTestid}-respondent-identifier`}
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
                defaultSelectedAll
                data-testid={`${dataTestid}-versions`}
              />
            </Box>
          </StyledFlexTopCenter>
        </Box>
      )}
    </form>
  );
};
