import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledTitleMedium, StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { ItemFlowSelectController } from 'modules/Builder/components/ItemFlowSelectController/ItemFlowSelectController';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';

import { StyledCondition } from './Condition.styles';
import { ConditionProps } from './Condition.types';
import { getScoreConditionOptions, getStateOptions } from './Condition.utils';
import { SwitchCondition } from './SwitchCondition';
import { ConditionItemType } from './Condition.const';

const ConditionComponent = ({
  itemName,
  stateName,
  payloadName,
  itemOptions,
  valueOptions,
  item,
  state,
  onItemChange,
  onStateChange,
  isRemoveVisible,
  onRemove,
  type,
  'data-testid': dataTestid,
}: ConditionProps) => {
  const { t } = useTranslation('app');
  const { control } = useCustomFormContext();

  const selectedItem = useMemo(
    () => itemOptions?.find(({ value }) => value === item),
    [itemOptions, item],
  );

  const isRowTypeItem = type === ConditionRowType.Item;
  const isRowTypeScore = type === ConditionRowType.Score;
  const isStateSelectDisabled = !selectedItem?.type;

  const optionValueName = `${payloadName}.optionValue`;
  const numberValueName = `${payloadName}.value`;
  const isItemScoreCondition = selectedItem?.type === ConditionItemType.ScoreCondition;

  const switchConditionProps = useMemo(
    () => ({
      itemName,
      selectedItem,
      payloadName,
      state,
      dataTestid,
      valueOptions,
    }),
    [itemName, selectedItem, payloadName, state, dataTestid, valueOptions],
  );

  return (
    <StyledCondition data-testid={dataTestid}>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <ItemFlowSelectController
        control={control}
        customChange={onItemChange}
        data-testid={`${dataTestid}-name`}
        disabled={isRowTypeScore}
        name={itemName}
        options={itemOptions}
        placeholder={t(isRowTypeItem ? 'conditionItemNamePlaceholder' : 'select')}
        SelectProps={{
          renderValue: (value: unknown) => {
            const item = itemOptions?.find((item) => item.value === value);
            const placeholder = isRowTypeItem
              ? t('conditionItemSelected', { value: item?.labelKey })
              : item?.labelKey;

            return <span>{placeholder}</span>;
          },
        }}
        shouldSkipIcon={isRowTypeScore}
        tooltipTitle={selectedItem?.question}
      />
      <SwitchCondition {...switchConditionProps}>
        <ItemFlowSelectController
          control={control}
          customChange={onStateChange}
          data-testid={`${dataTestid}-type`}
          disabled={isStateSelectDisabled}
          name={stateName}
          options={getStateOptions(selectedItem?.type)}
          placeholder={
            isStateSelectDisabled
              ? t('conditionDisabledPlaceholder')
              : t('conditionTypePlaceholder')
          }
        />
      </SwitchCondition>
      {isStateSelectDisabled && (
        <>
          <ItemFlowSelectController
            control={control}
            customChange={onStateChange}
            data-testid={`${dataTestid}-type`}
            disabled
            name={stateName}
            options={getStateOptions()}
            placeholder={t('conditionDisabledPlaceholder')}
          />
          <ItemFlowSelectController
            control={control}
            data-testid={`${dataTestid}-selection-value`}
            disabled
            name={isItemScoreCondition ? numberValueName : optionValueName}
            options={isItemScoreCondition ? getScoreConditionOptions() : valueOptions}
            placeholder={t('conditionDisabledPlaceholder')}
          />
        </>
      )}
      {isRemoveVisible && (
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={onRemove}
          data-testid={`${dataTestid}-remove`}
        >
          <Svg id="cross" />
        </StyledClearedButton>
      )}
    </StyledCondition>
  );
};

// Memoize component to prevent unnecessary re-renders
export const Condition = memo(ConditionComponent);
