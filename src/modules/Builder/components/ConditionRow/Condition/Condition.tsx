import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';

import { StyledTitleMedium, StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { CONDITION_TYPES_TO_HAVE_RANGE_VALUE } from 'shared/consts';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';

import { StyledCondition, StyledInputController, StyledSelectController } from './Condition.styles';
import { ConditionProps } from './Condition.types';
import { ConditionItemType } from './Condition.const';
import {
  getConditionMinMaxRangeValues,
  getConditionMinMaxValues,
  getScoreConditionOptions,
  getStateOptions,
} from './Condition.utils';

export const Condition = ({
  itemName,
  stateName,
  optionValueName,
  numberValueName,
  minValueName,
  maxValueName,
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

  const selectedItem = itemOptions?.find(({ value }) => value === item);

  const isItemSlider = selectedItem?.type === ConditionItemType.Slider;
  const isItemScore = selectedItem?.type === ConditionItemType.Score;
  const isItemScoreCondition = selectedItem?.type === ConditionItemType.ScoreCondition;
  const isRowTypeItem = type === ConditionRowType.Item;
  const isRowTypeScore = type === ConditionRowType.Score;
  const isItemSelect =
    selectedItem?.type === ConditionItemType.SingleSelection ||
    selectedItem?.type === ConditionItemType.MultiSelection ||
    isItemScoreCondition;
  const isValueSelectShown = !selectedItem || isItemSelect;
  const isNumberValueShown = (isItemSlider || isItemScore) && !CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(state);
  const isRangeValueShown = (isItemSlider || isItemScore) && !isNumberValueShown;
  const { minNumber, maxNumber } = getConditionMinMaxValues({
    item: selectedItem,
    state,
  });
  const [minValue, maxValue] = useWatch({ name: [minValueName, maxValueName] });
  const isValueSelectDisabled = !isItemScoreCondition && !valueOptions?.length;
  const isStateSelectDisabled = !selectedItem?.type;

  const { leftRange, rightRange } = getConditionMinMaxRangeValues({
    item: selectedItem,
    minValue,
    maxValue,
  });

  return (
    <StyledCondition data-testid={dataTestid}>
      <StyledTitleMedium>{t('if')}</StyledTitleMedium>
      <StyledSelectController
        control={control}
        name={itemName}
        options={itemOptions}
        placeholder={t(isRowTypeItem ? 'conditionItemNamePlaceholder' : 'select')}
        SelectProps={{
          renderValue: (value: unknown) => {
            const item = itemOptions?.find(item => item.value === value);
            const placeholder = isRowTypeItem ? t('conditionItemSelected', { value: item?.labelKey }) : item?.labelKey;

            return <span>{placeholder}</span>;
          },
        }}
        customChange={onItemChange}
        disabled={isRowTypeScore}
        shouldSkipIcon={isRowTypeScore}
        isLabelNeedTranslation={false}
        data-testid={`${dataTestid}-name`}
      />
      {!isRowTypeItem && <StyledTitleMedium>{t('is')}</StyledTitleMedium>}
      <StyledSelectController
        control={control}
        name={stateName}
        options={getStateOptions(selectedItem?.type)}
        placeholder={isStateSelectDisabled ? t('conditionDisabledPlaceholder') : t('conditionTypePlaceholder')}
        customChange={onStateChange}
        isLabelNeedTranslation={false}
        data-testid={`${dataTestid}-type`}
        disabled={isStateSelectDisabled}
      />
      {isValueSelectShown && (
        <StyledSelectController
          control={control}
          name={isItemScoreCondition ? numberValueName : optionValueName}
          options={isItemScoreCondition ? getScoreConditionOptions() : valueOptions}
          placeholder={isValueSelectDisabled ? t('conditionDisabledPlaceholder') : t('value')}
          isLabelNeedTranslation={false}
          data-testid={`${dataTestid}-selection-value`}
          disabled={isValueSelectDisabled}
        />
      )}
      {isNumberValueShown && (
        <StyledInputController
          type="number"
          control={control}
          name={numberValueName}
          minNumberValue={minNumber}
          maxNumberValue={maxNumber}
          data-testid={`${dataTestid}-slider-value`}
        />
      )}
      {isRangeValueShown && (
        <>
          <StyledInputController
            key={`min-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={minValueName}
            minNumberValue={leftRange.minNumber}
            maxNumberValue={leftRange.maxNumber}
            data-testid={`${dataTestid}-min-value`}
          />
          <StyledInputController
            key={`max-value-${isRangeValueShown}`}
            type="number"
            control={control}
            name={maxValueName}
            minNumberValue={rightRange.minNumber}
            maxNumberValue={rightRange.maxNumber}
            data-testid={`${dataTestid}-max-value`}
          />
        </>
      )}
      {isRemoveVisible && (
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onRemove} data-testid={`${dataTestid}-remove`}>
          <Svg id="cross" />
        </StyledClearedButton>
      )}
    </StyledCondition>
  );
};
