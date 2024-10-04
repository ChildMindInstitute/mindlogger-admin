import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { RadioGroupController } from 'shared/components/FormComponents';
import { StyledContainerWithBg, StyledTitleMedium, theme, variables } from 'shared/styles';
import { ToggleItemContainer } from 'modules/Builder/components';
import { DataTable, DataTableItem, SwitchWithState } from 'shared/components';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { LookupTableItems, SubscaleTotalScore } from 'shared/consts';
import { getEntityKey, isSystemItem, toggleBooleanState } from 'shared/utils';
import { TotalScoresTableDataSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { checkOnItemTypeAndScore } from 'shared/utils/checkOnItemTypeAndScore';
import { ActivitySettingsSubscale, AgeFieldType, ScoreOrSection, ScoreReport } from 'shared/state';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { commonButtonProps } from '../ActivitySettings.const';
import {
  getOptions,
  getTotalScoreTableColumnData,
  totalScoreTableTemplate,
} from './SubscalesConfiguration.const';
import {
  getSubscalesDefaults,
  getAllElementsTableColumns,
  getNotUsedElements,
  getUsedWithinSubscalesElements,
  getPropertiesToFilterByIds,
  getAddTotalScoreModalLabels,
} from './SubscalesConfiguration.utils';
import { SubscaleHeaderContent } from './SubscaleHeaderContent';
import { SubscaleContent } from './SubscaleContent';
import {
  StyledButtonsContainer,
  StyledSvg,
  StyledSvgButton,
} from './SubscalesConfiguration.styles';
import { SubscaleContentProps } from './SubscalesConfiguration.types';
import { LookupTable } from './LookupTable';
import { useSubscalesSystemItemsSetup } from './SubscalesConfiguration.hooks';

export const SubscalesConfiguration = () => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const { fieldName, activity } = useCurrentActivity();

  useRedirectIfNoMatchedActivity();

  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const calculateTotalScoreField = `${fieldName}.subscaleSetting.calculateTotalScore`;
  const totalScoresTableDataField = `${fieldName}.subscaleSetting.totalScoresTableData`;
  const itemsFieldName = `${fieldName}.items`;
  const {
    append: appendSubscale,
    remove: removeSubscale,
    update: updateSubscale,
  } = useFieldArray({
    control,
    name: subscalesField,
  });

  const reportsField = `${fieldName}.scoresAndReports.reports`;
  const { fields: reports, update: updateReport } = useFieldArray<
    Record<string, ScoreOrSection[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: reportsField,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const calculateTotalScore = watch(calculateTotalScoreField);
  const [calculateTotalScoreSwitch, setCalculateTotalScoreSwitch] = useState(!!calculateTotalScore);
  const [isLookupTableOpened, setIsLookupTableOpened] = useState(false);
  const tableData = watch(totalScoresTableDataField) ?? [];
  const onTableDataUpdate = (data?: DataTableItem[]) => {
    setValue(totalScoresTableDataField, data, { shouldDirty: true });
  };
  const iconId = tableData?.length ? 'lookup-table-filled' : 'lookup-table';
  const dataTestid = 'builder-activity-settings-subscales';

  const subscales: SubscaleFormValue[] = watch(subscalesField) ?? [];
  const subscalesLength = subscales.length;
  const filteredItems = (activity?.items ?? []).filter(checkOnItemTypeAndScore);
  const { subscalesMap, itemsMap, mergedIds, markedUniqueElementsIds } = getPropertiesToFilterByIds(
    filteredItems,
    subscales,
  );
  const notUsedElements: SubscaleContentProps['notUsedElements'] = getNotUsedElements(
    subscalesMap,
    itemsMap,
    mergedIds,
    markedUniqueElementsIds,
  );
  const usedWithinSubscalesElements = getUsedWithinSubscalesElements(
    subscales,
    subscalesMap,
    itemsMap,
    mergedIds,
    markedUniqueElementsIds,
  );

  const handleAddSubscale = () => {
    appendSubscale(getSubscalesDefaults());
  };

  const resetCalculateTotalScoreField = (shouldDirty: boolean) => {
    setValue(calculateTotalScoreField, null, { shouldDirty });
    setValue(totalScoresTableDataField, null, { shouldDirty });
  };

  const calculateTotalScoreSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggleBooleanState(setCalculateTotalScoreSwitch)();
    if (e.target.checked) {
      setValue(calculateTotalScoreField, calculateTotalScore ?? SubscaleTotalScore.Sum, {
        shouldDirty: true,
      });

      return;
    }
    resetCalculateTotalScoreField(true);
  };

  useEffect(() => {
    if (subscalesLength) return;

    setCalculateTotalScoreSwitch(false);
    resetCalculateTotalScoreField(false);
  }, [!!subscalesLength]);

  useEffect(() => {
    if (!calculateTotalScore) return;

    setCalculateTotalScoreSwitch(!!calculateTotalScore);
  }, [!!calculateTotalScore]);

  const items: ItemFormValues[] = watch(itemsFieldName) ?? [];
  const ageScreenItem = items?.find(
    (item) => isSystemItem(item) && item.name === LookupTableItems.Age_screen,
  );
  const [ageFieldType, setAgeFieldType] = useState<AgeFieldType>(
    ageScreenItem?.responseType === 'numberSelect' ? 'dropdown' : 'text',
  );

  useSubscalesSystemItemsSetup(subscales, ageFieldType);
  const hasLookupTable = subscales?.some((subscale) => !!subscale.subscaleTableData);

  /** Remove this subscale from any report scores that are linked to it */
  const removeReportScoreLink = (subscale: ActivitySettingsSubscale<string>) => {
    reports.forEach((report, index) => {
      if (
        report.type === 'score' &&
        report.scoringType === 'score' &&
        report.linkedSubscaleName === subscale.name
      ) {
        const updatedReport: ScoreReport = {
          ...report,
          linkedSubscaleName: '',
        };
        updateReport(index, updatedReport);
      }
    });
  };

  return (
    <StyledButtonsContainer>
      {subscales?.map((subscale, index) => {
        const subscaleField = `${subscalesField}.${index}`;
        const title = t('subscaleHeader', {
          index: index + 1,
          name: subscale?.name,
        });
        const subscaleDataTestid = `${dataTestid}-${index}`;

        return (
          <ToggleItemContainer
            key={`data-subscale-${getEntityKey(subscale) || index}`}
            HeaderContent={SubscaleHeaderContent}
            Content={SubscaleContent}
            headerContentProps={{
              onRemove: () => {
                removeSubscale(index);
                removeReportScoreLink(subscale);
              },
              name: subscaleField,
              title,
              onUpdate: (subscaleTableData?: string) => {
                updateSubscale(index, {
                  ...subscale,
                  subscaleTableData,
                });

                if (!subscaleTableData) {
                  removeReportScoreLink(subscale);
                }
              },
              'data-testid': subscaleDataTestid,
            }}
            contentProps={{
              subscaleId: subscale.id,
              name: subscaleField,
              notUsedElements,
              'data-testid': subscaleDataTestid,
            }}
            data-testid={subscaleDataTestid}
          />
        );
      })}
      <Button
        {...commonButtonProps}
        onClick={handleAddSubscale}
        sx={{ mb: theme.spacing(2) }}
        data-testid={`${dataTestid}-add`}
      >
        {t('addSubscales')}
      </Button>
      {!!subscalesLength && (
        <>
          <StyledTitleMedium>{t('elementsAssociatedWithSubscales')}</StyledTitleMedium>
          <DataTable
            tableHeadBackground={variables.palette.surface}
            columns={getAllElementsTableColumns()}
            data={usedWithinSubscalesElements}
            noDataPlaceholder={t('noElementsYet')}
            data-testid={`${dataTestid}-elements-associated-with-subscales`}
          />
          {hasLookupTable && (
            <FormControl sx={{ mt: 2, flexDirection: 'row', alignItems: 'center', gap: 1.6 }}>
              <FormLabel id="age-field-type-radio-btns-label">
                <StyledTitleMedium>{t('ageFieldTypeLabel')}</StyledTitleMedium>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="age-field-type-radio-btns-label"
                value={ageFieldType}
                onChange={(e) => setAgeFieldType(e.target.value as AgeFieldType)}
              >
                <FormControlLabel
                  value="text"
                  control={<Radio />}
                  label={t('ageFieldTypeText')}
                  data-testid={`${dataTestid}-age-field-type-text`}
                />
                <FormControlLabel
                  value="dropdown"
                  control={<Radio />}
                  label={t('ageFieldTypeDropdown')}
                  data-testid={`${dataTestid}-age-field-type-dropdown`}
                />
              </RadioGroup>
            </FormControl>
          )}
          <SwitchWithState
            checked={calculateTotalScoreSwitch}
            handleChange={calculateTotalScoreSwitchChange}
            label={t('calculateTotalScore')}
            tooltipText={t('calculateTotalScoreTooltip')}
            data-testid={`${dataTestid}-calculate-total-score`}
          />
        </>
      )}
      {calculateTotalScoreSwitch && (
        <StyledContainerWithBg data-testid="builder-activity-settings">
          <StyledSvgButton
            onClick={() => {
              setIsLookupTableOpened(true);
            }}
            data-testid={`${dataTestid}-lookup-table`}
          >
            <StyledSvg isFilled={!!tableData?.length} id={iconId} width="20" height="20" />
          </StyledSvgButton>
          <RadioGroupController
            key={calculateTotalScoreField}
            name={calculateTotalScoreField}
            control={control}
            options={getOptions()}
            defaultValue={SubscaleTotalScore.Sum}
            data-testid={`${dataTestid}-calculate-total-score-value`}
          />
        </StyledContainerWithBg>
      )}
      {isLookupTableOpened && (
        <LookupTable
          open={isLookupTableOpened}
          labelsObject={getAddTotalScoreModalLabels()}
          columnData={getTotalScoreTableColumnData()}
          tableData={tableData}
          template={totalScoreTableTemplate}
          templatePrefix={'total_score_'}
          schema={TotalScoresTableDataSchema}
          onUpdate={onTableDataUpdate}
          onClose={() => {
            setIsLookupTableOpened(false);
          }}
          data-testid={`${dataTestid}-lookup-table-popup`}
        />
      )}
    </StyledButtonsContainer>
  );
};
