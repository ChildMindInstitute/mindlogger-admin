import { ChangeEvent, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { RadioGroupController } from 'shared/components/FormComponents';
import { StyledContainerWithBg, StyledTitleMedium, theme, variables } from 'shared/styles';
import { ToggleItemContainer } from 'modules/Builder/components';
import { DataTable, DataTableItem, SwitchWithState } from 'shared/components';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { SubscaleTotalScore } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { TotalScoresTableDataSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';
import { SubscaleFormValue } from 'modules/Builder/types';

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
import { checkOnItemTypeAndScore } from '../ActivitySettings.utils';

export const SubscalesConfiguration = () => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const { fieldName, activity } = useCurrentActivity();

  useRedirectIfNoMatchedActivity();

  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const calculateTotalScoreField = `${fieldName}.subscaleSetting.calculateTotalScore`;
  const totalScoresTableDataField = `${fieldName}.subscaleSetting.totalScoresTableData`;
  const {
    append: appendSubscale,
    remove: removeSubscale,
    update: updateSubscale,
  } = useFieldArray({
    control,
    name: subscalesField,
  });
  const calculateTotalScore = watch(calculateTotalScoreField);
  const [calculateTotalScoreSwitch, setCalculateTotalScoreSwitch] = useState(!!calculateTotalScore);
  const [isLookupTableOpened, setIsLookupTableOpened] = useState(false);
  const tableData = watch(totalScoresTableDataField) ?? [];
  const onTableDataUpdate = (data?: DataTableItem[]) => {
    setValue(totalScoresTableDataField, data, { shouldDirty: true });
  };
  const iconId = `lookup-table${tableData?.length ? '-filled' : ''}`;

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
    setCalculateTotalScoreSwitch((prevState) => !prevState);
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

  useSubscalesSystemItemsSetup(subscales);

  return (
    <StyledButtonsContainer>
      {subscales?.map((subscale, index) => {
        const subscaleField = `${subscalesField}.${index}`;
        const title = t('subscaleHeader', {
          index: index + 1,
          name: subscale?.name,
        });
        const dataTestid = `builder-activity-settings-subscales-${index}`;

        return (
          <ToggleItemContainer
            key={`data-subscale-${getEntityKey(subscale) || index}`}
            HeaderContent={SubscaleHeaderContent}
            Content={SubscaleContent}
            headerContentProps={{
              onRemove: () => {
                removeSubscale(index);
              },
              name: subscaleField,
              title,
              onUpdate: (subscaleTableData?: string) => {
                updateSubscale(index, {
                  ...subscale,
                  subscaleTableData,
                });
              },
              'data-testid': dataTestid,
            }}
            contentProps={{
              subscaleId: subscale.id,
              name: subscaleField,
              notUsedElements,
              'data-testid': dataTestid,
            }}
            data-testid={dataTestid}
          />
        );
      })}
      <Button
        {...commonButtonProps}
        onClick={handleAddSubscale}
        sx={{ mb: theme.spacing(2) }}
        data-testid="builder-activity-settings-subscales-add"
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
            data-testid="builder-activity-settings-subscales-elements-associated-with-subscales"
          />
          <SwitchWithState
            checked={calculateTotalScoreSwitch}
            handleChange={calculateTotalScoreSwitchChange}
            label={t('calculateTotalScore')}
            tooltipText={t('calculateTotalScoreTooltip')}
            data-testid="builder-activity-settings-subscales-calculate-total-score"
          />
        </>
      )}
      {calculateTotalScoreSwitch && (
        <StyledContainerWithBg>
          <StyledSvgButton
            onClick={() => {
              setIsLookupTableOpened(true);
            }}
            data-testid="builder-activity-settings-subscales-lookup-table"
          >
            <StyledSvg isFilled={!!tableData?.length} id={iconId} width="20" height="20" />
          </StyledSvgButton>
          <RadioGroupController
            key={calculateTotalScoreField}
            name={calculateTotalScoreField}
            control={control}
            options={getOptions()}
            defaultValue={SubscaleTotalScore.Sum}
            data-testid="builder-activity-settings-subscales-calculate-total-score-value"
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
          data-testid="builder-activity-settings-subscales-lookup-table-popup"
        />
      )}
    </StyledButtonsContainer>
  );
};
