import { ChangeEvent } from 'react';
import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { DatePicker, TimePicker } from 'shared/components';
import { StyledBodyLarge, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { Switch, TagsAutocompleteController } from 'shared/components/FormComponents';
import { DatavizActivity } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';

import { FetchAnswers } from '../../RespondentDataSummary.types';
import { useRespondentAnswers } from '../../hooks/useRespondentAnswers';
import { getUniqueIdentifierOptions } from './ReportFilters.utils';
import { StyledFiltersContainer, StyledMoreFilters, StyledTimeText } from './ReportFilters.styles';
import {
  FiltersChangeType,
  OnFiltersChangeParams,
  ReportFiltersProps,
} from './ReportFilters.types';
import { MIN_DATE } from './ReportFilters.const';

export const ReportFilters = ({
  identifiers = [],
  versions = [],
  setIsLoading,
}: ReportFiltersProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useFormContext();
  const { fetchAnswers } = useRespondentAnswers();

  const [moreFiltersVisible, filterByIdentifier, startDate, endDate, activity]: [
    boolean,
    boolean,
    Date,
    Date,
    DatavizActivity,
  ] = useWatch({
    name: ['moreFiltersVisible', 'filterByIdentifier', 'startDate', 'endDate', 'selectedActivity'],
  });

  const versionsOptions = versions.map(({ version }) => ({ label: version, id: version }));
  const identifiersOptions = getUniqueIdentifierOptions(identifiers);
  const dataTestid = 'respondents-summary-filters';

  const moreFiltersHandler = () => {
    setValue('moreFiltersVisible', !moreFiltersVisible);
  };

  const onFiltersChange = async ({
    type,
    startTime,
    endTime,
    filterByIdentifier,
    identifier,
    versions,
  }: OnFiltersChangeParams) => {
    setIsLoading(true);
    let fetchParams: FetchAnswers = { activity };

    switch (type) {
      case FiltersChangeType.StartDate:
        if (endDate < startDate) {
          const newEndDate = addDays(startDate, 1);
          setValue('endDate', newEndDate);
          fetchParams = { ...fetchParams, endDate: newEndDate };
        }
        break;
      case FiltersChangeType.Time:
        fetchParams = { ...fetchParams, startTime, endTime };
        break;
      case FiltersChangeType.FilterByIdentifier:
        fetchParams = { ...fetchParams, filterByIdentifier, isIdentifiersChange: true };
        break;
      case FiltersChangeType.Identifiers:
        fetchParams = { ...fetchParams, identifier, isIdentifiersChange: true };
        break;
      case FiltersChangeType.Versions:
        fetchParams = { ...fetchParams, versions };
        break;
      default:
        break;
    }

    await fetchAnswers(fetchParams);
    setIsLoading(false);
  };

  return (
    <form>
      <StyledFiltersContainer>
        <StyledFlexTopCenter>
          <DatePicker
            minDate={MIN_DATE}
            name="startDate"
            control={control}
            inputWrapperSx={{ width: '19rem' }}
            onCloseCallback={() => onFiltersChange({ type: FiltersChangeType.StartDate })}
            label={t('startDate')}
            disabled={false}
            data-testid={`${dataTestid}-start-date`}
          />
          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <DatePicker
            minDate={startDate}
            name="endDate"
            control={control}
            inputWrapperSx={{ width: '19rem' }}
            onCloseCallback={() => onFiltersChange({ type: FiltersChangeType.EndDate })}
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
            onCustomChange={(newTime: string) =>
              onFiltersChange({ startTime: newTime, type: FiltersChangeType.Time })
            }
            data-testid={`${dataTestid}-start-time`}
            defaultTime="00:00"
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
            onCustomChange={(newTime: string) =>
              onFiltersChange({ endTime: newTime, type: FiltersChangeType.Time })
            }
            data-testid={`${dataTestid}-end-time`}
            defaultTime="23:59"
          />
          <StyledMoreFilters
            onClick={moreFiltersHandler}
            sx={{
              backgroundColor: moreFiltersVisible ? variables.palette.primary_alfa12 : '',
            }}
            data-testid={`${dataTestid}-more-button`}
          >
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
              onCustomChange={(event: ChangeEvent<HTMLInputElement>) =>
                onFiltersChange({
                  type: FiltersChangeType.FilterByIdentifier,
                  filterByIdentifier: event.target.checked,
                })
              }
              data-testid={`${dataTestid}-filter-by-identifier`}
            />
          )}
          <StyledFlexTopCenter sx={{ mt: theme.spacing(0.8) }}>
            <Box sx={{ width: '36rem' }}>
              <TagsAutocompleteController
                name="identifier"
                limitTags={2}
                label={t('responseIdentifier')}
                options={identifiersOptions}
                control={control}
                noOptionsText={t('noResponseIdentifier')}
                labelAllSelect={t('selectAll')}
                disabled={!filterByIdentifier}
                onCustomChange={(options: AutocompleteOption[]) =>
                  onFiltersChange({
                    type: FiltersChangeType.Identifiers,
                    identifier: options,
                  })
                }
                data-testid={`${dataTestid}-respondent-identifier`}
              />
            </Box>
            <Box sx={{ width: '36rem', ml: theme.spacing(2.4) }}>
              <TagsAutocompleteController
                name="versions"
                limitTags={2}
                label={t('versions')}
                options={versionsOptions}
                control={control}
                noOptionsText={t('noVersions')}
                labelAllSelect={t('selectAll')}
                defaultSelectedAll
                onCustomChange={(options: AutocompleteOption[]) =>
                  onFiltersChange({
                    type: FiltersChangeType.Versions,
                    versions: options,
                  })
                }
                data-testid={`${dataTestid}-versions`}
              />
            </Box>
          </StyledFlexTopCenter>
        </Box>
      )}
    </form>
  );
};
