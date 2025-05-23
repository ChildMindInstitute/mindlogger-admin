import { ChangeEvent, useEffect } from 'react';
import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { DatePicker, TimePicker, Tooltip } from 'shared/components';
import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledTitleTooltipIcon,
  theme,
  variables,
} from 'shared/styles';
import {
  CheckboxController,
  Switch,
  TagsAutocompleteController,
} from 'shared/components/FormComponents';
import { useRespondentDataContext } from 'modules/Dashboard/features/RespondentData/RespondentDataContext';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'shared/consts';

import { FetchAnswers } from '../../RespondentDataSummary.types';
import { useRespondentAnswers } from '../../hooks/useRespondentAnswers';
import { getUniqueIdentifierOptions } from './ReportFilters.utils';
import {
  StyledFiltersContainer,
  StyledMoreFilters,
  StyledTimeText,
  StyledCheckboxTitle,
} from './ReportFilters.styles';
import {
  FiltersChangeType,
  OnFiltersChangeParams,
  ReportFiltersProps,
} from './ReportFilters.types';
import { MIN_DATE } from './ReportFilters.const';
import { useDatavizSkippedFilter } from '../../hooks/useDatavizSkippedFilter';

export const ReportFilters = ({
  identifiers = [],
  versions = [],
  setIsLoading,
}: ReportFiltersProps) => {
  const { t } = useTranslation('app');
  const { control, setValue } = useFormContext();
  const { fetchAnswers } = useRespondentAnswers();
  const { selectedEntity } = useRespondentDataContext();

  const [moreFiltersVisible, filterByIdentifier, startDate, endDate]: [
    boolean,
    boolean,
    Date,
    Date,
  ] = useWatch({
    name: ['moreFiltersVisible', 'filterByIdentifier', 'startDate', 'endDate'],
  });
  const { hideSkipped, setSkipped } = useDatavizSkippedFilter();

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
    if (!selectedEntity) return;

    setIsLoading(true);
    let fetchParams: FetchAnswers = { entity: selectedEntity };

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

  useEffect(() => {
    setValue('hideSkipped', hideSkipped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            defaultTime={DEFAULT_START_TIME}
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
            defaultTime={DEFAULT_END_TIME}
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
                textFieldProps={{ label: t('responseIdentifier') }}
                options={identifiersOptions}
                control={control}
                noOptionsText={t('noResponseIdentifier')}
                labelAllSelect={t('selectAll')}
                disabled={!filterByIdentifier}
                onCustomChange={(options) =>
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
                textFieldProps={{ label: t('versions') }}
                options={versionsOptions}
                control={control}
                noOptionsText={t('noVersions')}
                labelAllSelect={t('selectAll')}
                defaultSelectedAll
                onCustomChange={(options) =>
                  onFiltersChange({
                    type: FiltersChangeType.Versions,
                    versions: options,
                  })
                }
                data-testid={`${dataTestid}-versions`}
              />
            </Box>
            <Box sx={{ whiteSpace: 'nowrap', ml: 2.4 }}>
              <CheckboxController
                name="hideSkipped"
                control={control}
                label={
                  <StyledCheckboxTitle>
                    {t('hideSkipped')}
                    <Tooltip tooltipTitle={t('hideSkippedTooltip')}>
                      <span>
                        <StyledTitleTooltipIcon id="more-info-outlined" />
                      </span>
                    </Tooltip>
                  </StyledCheckboxTitle>
                }
                data-testid={`${dataTestid}-hide-skipped`}
                sx={{ mr: 0 }}
                onCustomChange={() => setSkipped(!hideSkipped)}
              />
            </Box>
          </StyledFlexTopCenter>
        </Box>
      )}
    </form>
  );
};
